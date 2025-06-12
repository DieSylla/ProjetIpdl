/**
 * Gestionnaire centralisé pour les opérations CRUD sur localStorage
 * Ce module fournit des fonctions pour manipuler les données de l'application
 * de manière cohérente et sécurisée.
 */

// Clés utilisées dans localStorage
const STORAGE_KEYS = {
  USERS: 'registeredUsers',
  CURRENT_USER: 'currentUser',
  TUTORIALS: 'tutoriels',
  SUBJECTS: 'subjects',
  SYSTEM_SETTINGS: 'systemSettings',
  ACTIVITY_LOGS: 'activityLogs',
  STATISTICS: 'statistics'
};

/**
 * Récupère des données depuis localStorage
 * @param {string} key - Clé de stockage
 * @param {any} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {any} Les données récupérées ou la valeur par défaut
 */
export const getData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Sauvegarde des données dans localStorage
 * @param {string} key - Clé de stockage
 * @param {any} data - Données à sauvegarder
 * @returns {boolean} Succès de l'opération
 */
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données (${key}):`, error);
    return false;
  }
};

/**
 * Récupère tous les utilisateurs enregistrés
 * @returns {Array} Liste des utilisateurs
 */
export const getUsers = () => getData(STORAGE_KEYS.USERS, []);

/**
 * Sauvegarde la liste des utilisateurs
 * @param {Array} users - Liste des utilisateurs
 * @returns {boolean} Succès de l'opération
 */
export const saveUsers = (users) => saveData(STORAGE_KEYS.USERS, users);

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns {Object|null} Utilisateur connecté ou null
 */
export const getCurrentUser = () => getData(STORAGE_KEYS.CURRENT_USER, null);

/**
 * Récupère tous les tutoriels
 * @returns {Array} Liste des tutoriels
 */
export const getTutorials = () => getData(STORAGE_KEYS.TUTORIALS, []);

/**
 * Sauvegarde la liste des tutoriels
 * @param {Array} tutorials - Liste des tutoriels
 * @returns {boolean} Succès de l'opération
 */
export const saveTutorials = (tutorials) => saveData(STORAGE_KEYS.TUTORIALS, tutorials);

/**
 * Récupère toutes les matières
 * @returns {Array} Liste des matières
 */
export const getSubjects = () => getData(STORAGE_KEYS.SUBJECTS, []);

/**
 * Sauvegarde la liste des matières
 * @param {Array} subjects - Liste des matières
 * @returns {boolean} Succès de l'opération
 */
export const saveSubjects = (subjects) => saveData(STORAGE_KEYS.SUBJECTS, subjects);

/**
 * Récupère les paramètres système
 * @returns {Object} Paramètres système
 */
export const getSystemSettings = () => getData(STORAGE_KEYS.SYSTEM_SETTINGS, {
  maxTutorialsPerInstructor: 50,
  defaultUserRole: 'etudiant',
  allowRegistration: true,
  moderationEnabled: false
});

/**
 * Sauvegarde les paramètres système
 * @param {Object} settings - Paramètres système
 * @returns {boolean} Succès de l'opération
 */
export const saveSystemSettings = (settings) => saveData(STORAGE_KEYS.SYSTEM_SETTINGS, settings);

/**
 * Récupère les logs d'activité
 * @returns {Array} Liste des logs d'activité
 */
export const getActivityLogs = () => getData(STORAGE_KEYS.ACTIVITY_LOGS, []);

/**
 * Ajoute un log d'activité
 * @param {string} action - Action effectuée
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} details - Détails supplémentaires
 * @returns {boolean} Succès de l'opération
 */
export const addActivityLog = (action, userId, details = {}) => {
  const logs = getActivityLogs();
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    userId,
    details
  };
  
  logs.unshift(newLog); // Ajouter au début pour avoir les plus récents en premier
  
  // Limiter le nombre de logs (garder les 1000 plus récents)
  const trimmedLogs = logs.slice(0, 1000);
  
  return saveData(STORAGE_KEYS.ACTIVITY_LOGS, trimmedLogs);
};

/**
 * Récupère les statistiques
 * @returns {Object} Statistiques
 */
export const getStatistics = () => getData(STORAGE_KEYS.STATISTICS, {
  lastUpdated: null,
  userCounts: {},
  tutorialCounts: {},
  activityTimeline: []
});

/**
 * Sauvegarde les statistiques
 * @param {Object} statistics - Statistiques
 * @returns {boolean} Succès de l'opération
 */
export const saveStatistics = (statistics) => saveData(STORAGE_KEYS.STATISTICS, statistics);

// Exporter les clés de stockage pour utilisation dans d'autres modules
export { STORAGE_KEYS };
