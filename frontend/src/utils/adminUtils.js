/**
 * Fonctions utilitaires pour les opérations administratives
 * Ce module fournit des fonctions spécifiques pour la gestion des utilisateurs,
 * des matières et des paramètres système par l'administrateur.
 */

import { 
  getUsers, 
  saveUsers, 
  getTutorials, 
  saveTutorials,
  getSubjects,
  saveSubjects,
  getSystemSettings,
  saveSystemSettings,
  addActivityLog
} from './dataManager';

/**
 * Exporte la fonction getSubjects depuis dataManager pour faciliter l'accès
 */
export { getSubjects };

/**
 * Récupère un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {Object|null} Utilisateur ou null
 */
export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};

/**
 * Récupère un utilisateur par son email
 * @param {string} email - Email de l'utilisateur
 * @returns {Object|null} Utilisateur ou null
 */
export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

/**
 * Met à jour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} updates - Mises à jour à appliquer
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Utilisateur mis à jour ou null
 */
export const updateUser = (userId, updates, adminId) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  // Empêcher la modification de certains champs sensibles
  const safeUpdates = { ...updates };
  delete safeUpdates.id; // Ne pas permettre de changer l'ID
  
  // Appliquer les mises à jour
  users[userIndex] = { ...users[userIndex], ...safeUpdates };
  
  // Sauvegarder les modifications
  if (saveUsers(users)) {
    // Enregistrer l'activité
    addActivityLog('update_user', adminId, { 
      targetUserId: userId, 
      updatedFields: Object.keys(safeUpdates) 
    });
    
    return users[userIndex];
  }
  
  return null;
};

/**
 * Change le rôle d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} newRole - Nouveau rôle
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Utilisateur mis à jour ou null
 */
export const changeUserRole = (userId, newRole, adminId) => {
  // Vérifier que le rôle est valide
  const validRoles = ['etudiant', 'instructeur', 'administrateur'];
  if (!validRoles.includes(newRole)) return null;
  
  return updateUser(userId, { role: newRole }, adminId);
};

/**
 * Désactive un compte utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Utilisateur mis à jour ou null
 */
export const disableUser = (userId, adminId) => {
  return updateUser(userId, { active: false }, adminId);
};

/**
 * Réactive un compte utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Utilisateur mis à jour ou null
 */
export const enableUser = (userId, adminId) => {
  return updateUser(userId, { active: true }, adminId);
};

/**
 * Réinitialise le mot de passe d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} newPassword - Nouveau mot de passe
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Utilisateur mis à jour ou null
 */
export const resetUserPassword = (userId, newPassword, adminId) => {
  if (!newPassword || newPassword.length < 6) return null;
  
  return updateUser(userId, { password: newPassword }, adminId);
};

/**
 * Ajoute une nouvelle matière
 * @param {Object} subject - Matière à ajouter
 * @param {string} adminId - ID de l'administrateur effectuant l'ajout
 * @returns {Object|null} Matière ajoutée ou null
 */
export const addSubject = (subject, adminId) => {
  if (!subject.nom) return null;
  
  const subjects = getSubjects();
  
  // Vérifier si la matière existe déjà
  if (subjects.some(s => s.nom.toLowerCase() === subject.nom.toLowerCase())) {
    return null;
  }
  
  const newSubject = {
    id: Date.now().toString(),
    nom: subject.nom,
    description: subject.description || '',
    dateCreation: new Date().toISOString(),
    createdBy: adminId
  };
  
  subjects.push(newSubject);
  
  if (saveSubjects(subjects)) {
    addActivityLog('add_subject', adminId, { subjectId: newSubject.id });
    return newSubject;
  }
  
  return null;
};

/**
 * Met à jour une matière
 * @param {string} subjectId - ID de la matière
 * @param {Object} updates - Mises à jour à appliquer
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Matière mise à jour ou null
 */
export const updateSubject = (subjectId, updates, adminId) => {
  const subjects = getSubjects();
  const subjectIndex = subjects.findIndex(s => s.id === subjectId);
  
  if (subjectIndex === -1) return null;
  
  // Empêcher la modification de certains champs
  const safeUpdates = { ...updates };
  delete safeUpdates.id;
  delete safeUpdates.dateCreation;
  delete safeUpdates.createdBy;
  
  // Appliquer les mises à jour
  subjects[subjectIndex] = { ...subjects[subjectIndex], ...safeUpdates };
  
  if (saveSubjects(subjects)) {
    addActivityLog('update_subject', adminId, { 
      subjectId, 
      updatedFields: Object.keys(safeUpdates) 
    });
    
    return subjects[subjectIndex];
  }
  
  return null;
};

/**
 * Supprime une matière
 * @param {string} subjectId - ID de la matière
 * @param {string} adminId - ID de l'administrateur effectuant la suppression
 * @returns {boolean} Succès de l'opération
 */
export const deleteSubject = (subjectId, adminId) => {
  const subjects = getSubjects();
  const filteredSubjects = subjects.filter(s => s.id !== subjectId);
  
  if (filteredSubjects.length === subjects.length) {
    // La matière n'existait pas
    return false;
  }
  
  if (saveSubjects(filteredSubjects)) {
    addActivityLog('delete_subject', adminId, { subjectId });
    return true;
  }
  
  return false;
};

/**
 * Met à jour les paramètres système
 * @param {Object} settings - Nouveaux paramètres
 * @param {string} adminId - ID de l'administrateur effectuant la modification
 * @returns {Object|null} Paramètres mis à jour ou null
 */
export const updateSystemSettings = (settings, adminId) => {
  const currentSettings = getSystemSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  
  if (saveSystemSettings(updatedSettings)) {
    addActivityLog('update_settings', adminId, { 
      updatedFields: Object.keys(settings) 
    });
    
    return updatedSettings;
  }
  
  return null;
};

/**
 * Recherche des utilisateurs selon des critères
 * @param {Object} criteria - Critères de recherche
 * @returns {Array} Utilisateurs correspondant aux critères
 */
export const searchUsers = (criteria = {}) => {
  const users = getUsers();
  
  // Si aucun critère n'est spécifié, retourner tous les utilisateurs
  if (Object.keys(criteria).length === 0) {
    return users;
  }
  
  // Filtrer les utilisateurs selon les critères
  let results = [...users];
  
  // Filtrer par requête de recherche (nom, prénom, email)
  if (criteria.query) {
    const query = criteria.query.toLowerCase();
    results = results.filter(user => 
      (user.nom && user.nom.toLowerCase().includes(query)) ||
      (user.prenom && user.prenom.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
  }
  
  // Filtrer par rôle
  if (criteria.role) {
    results = results.filter(user => user.role === criteria.role);
  }
  
  // Filtrer par statut (actif/inactif)
  if (criteria.active !== undefined) {
    results = results.filter(user => user.active === criteria.active);
  }
  
  // Trier les résultats
  if (criteria.sortBy) {
    const sortDirection = criteria.sortDirection === 'asc' ? 1 : -1;
    results.sort((a, b) => {
      // Gestion des valeurs nulles ou undefined
      const valA = a[criteria.sortBy] !== undefined ? a[criteria.sortBy] : '';
      const valB = b[criteria.sortBy] !== undefined ? b[criteria.sortBy] : '';
      
      if (valA < valB) return -1 * sortDirection;
      if (valA > valB) return 1 * sortDirection;
      return 0;
    });
  } else {
    // Tri par défaut par date de création (plus récent en premier)
    results.sort((a, b) => {
      const dateA = a.dateCreation ? new Date(a.dateCreation) : new Date(0);
      const dateB = b.dateCreation ? new Date(b.dateCreation) : new Date(0);
      return dateB - dateA;
    });
  }
  
  return results;
};

/**
 * Récupère des statistiques sur les tutoriels par instructeur
 * @returns {Array} Statistiques par instructeur
 */
export const getTutorialStatsByInstructor = () => {
  const users = getUsers();
  const tutorials = getTutorials();
  
  // Récupérer uniquement les instructeurs
  const instructors = users.filter(user => user.role === 'instructeur');
  
  // Calculer les statistiques pour chaque instructeur
  const stats = instructors.map(instructor => {
    // Compter les tutoriels créés par cet instructeur
    const instructorTutorials = tutorials.filter(tutorial => 
      tutorial.instructeurId === instructor.id
    );
    
    // Calculer le nombre total de vues pour les tutoriels de cet instructeur
    const totalViews = instructorTutorials.reduce((sum, tutorial) => 
      sum + (tutorial.vues || 0), 0
    );
    
    // Calculer la date du dernier tutoriel créé
    let lastTutorialDate = null;
    if (instructorTutorials.length > 0) {
      const dates = instructorTutorials
        .map(t => t.dateCreation)
        .filter(date => date)
        .map(date => new Date(date));
      
      if (dates.length > 0) {
        lastTutorialDate = new Date(Math.max(...dates));
      }
    }
    
    return {
      id: instructor.id,
      nom: instructor.nom,
      prenom: instructor.prenom,
      email: instructor.email,
      tutorialCount: instructorTutorials.length,
      totalViews: totalViews,
      lastTutorialDate: lastTutorialDate,
      averageViews: instructorTutorials.length > 0 ? Math.round(totalViews / instructorTutorials.length) : 0
    };
  });
  
  // Trier par nombre de tutoriels (décroissant)
  return stats.sort((a, b) => b.tutorialCount - a.tutorialCount);
};
