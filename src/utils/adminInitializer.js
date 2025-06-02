/**
 * Utilitaire pour initialiser un compte administrateur au démarrage de l'application
 * Ce script vérifie si un compte administrateur existe déjà et en crée un si nécessaire
 * Il initialise également les matières et les paramètres système
 */

import { initialSubjects } from '../data/initialSubjects';
import { defaultSettings } from '../data/defaultSettings';
import { 
  getUsers, 
  saveUsers, 
  getSubjects, 
  saveSubjects,
  getSystemSettings,
  saveSystemSettings,
  STORAGE_KEYS,
  addActivityLog
} from './dataManager';

/**
 * Initialise le compte administrateur
 * @returns {Object|null} Compte administrateur créé ou null
 */
const initializeAdmin = () => {
  // Récupérer les utilisateurs existants
  const registeredUsers = getUsers();
  
  // Vérifier si un administrateur existe déjà
  const adminExists = registeredUsers.some(user => user.role === 'administrateur');
  
  // Si aucun administrateur n'existe, en créer un
  if (!adminExists) {
    const adminUser = {
      id: Date.now().toString(),
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@example.com',
      password: 'admin123',  // Mot de passe par défaut
      role: 'administrateur',
      active: true,
      dateCreation: new Date().toISOString()
    };
    
    // Ajouter l'administrateur à la liste des utilisateurs
    registeredUsers.push(adminUser);
    
    // Sauvegarder la liste mise à jour
    if (saveUsers(registeredUsers)) {
      console.log('Compte administrateur créé avec succès!');
      console.log('Email: admin@example.com');
      console.log('Mot de passe: admin123');
      
      // Enregistrer l'activité
      addActivityLog('create_admin', adminUser.id, { automatic: true });
      
      return adminUser;
    }
  } else {
    console.log('Un compte administrateur existe déjà.');
  }
  
  return null;
};

/**
 * Initialise les matières
 */
const initializeSubjects = () => {
  // Récupérer les matières existantes
  const subjects = getSubjects();
  
  // Si aucune matière n'existe, initialiser avec les matières par défaut
  if (subjects.length === 0) {
    if (saveSubjects(initialSubjects)) {
      console.log(`${initialSubjects.length} matières initialisées avec succès!`);
      
      // Enregistrer l'activité
      addActivityLog('initialize_subjects', 'system', { count: initialSubjects.length });
    }
  }
};

/**
 * Initialise les paramètres système
 */
const initializeSystemSettings = () => {
  // Récupérer les paramètres existants
  const settings = getSystemSettings();
  
  // Vérifier si les paramètres sont vides (objet vide ou avec peu de propriétés)
  if (Object.keys(settings).length < 5) {
    if (saveSystemSettings(defaultSettings)) {
      console.log('Paramètres système initialisés avec succès!');
      
      // Enregistrer l'activité
      addActivityLog('initialize_settings', 'system', {});
    }
  }
};

/**
 * Initialise l'application avec un compte administrateur, des matières et des paramètres
 */
export const initializeAdminAccount = () => {
  // Initialiser le compte administrateur
  const admin = initializeAdmin();
  
  // Initialiser les matières
  initializeSubjects();
  
  // Initialiser les paramètres système
  initializeSystemSettings();
  
  return admin;
};

/**
 * Vérifie si l'utilisateur actuel est un administrateur
 * @returns {boolean} True si l'utilisateur est administrateur
 */
export const isAdmin = () => {
  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
  return currentUser && currentUser.role === 'administrateur';
};
