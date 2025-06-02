/**
 * Générateur de statistiques à partir des données existantes
 * Ce module fournit des fonctions pour calculer et générer des statistiques
 * basées sur les données de l'application.
 */

import { 
  getUsers, 
  getTutorials, 
  getActivityLogs, 
  saveStatistics, 
  getStatistics 
} from './dataManager';

/**
 * Calcule les statistiques des utilisateurs
 * @returns {Object} Statistiques des utilisateurs
 */
const calculateUserStatistics = () => {
  const users = getUsers();
  
  // Compter les utilisateurs par rôle
  const roleCount = users.reduce((acc, user) => {
    const role = user.role || 'non-défini';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  
  // Calculer les inscriptions par mois
  const registrationsByMonth = users.reduce((acc, user) => {
    if (user.dateCreation) {
      const date = new Date(user.dateCreation);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {});
  
  return {
    total: users.length,
    byRole: roleCount,
    registrationsByMonth,
    lastRegistered: users.length > 0 
      ? users.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))[0]
      : null
  };
};

/**
 * Calcule les statistiques des tutoriels
 * @returns {Object} Statistiques des tutoriels
 */
const calculateTutorialStatistics = () => {
  const tutorials = getTutorials();
  const users = getUsers();
  
  // Compter les tutoriels par niveau
  const levelCount = tutorials.reduce((acc, tutorial) => {
    const level = tutorial.niveau || 'non-défini';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  
  // Compter les tutoriels par matière
  const subjectCount = tutorials.reduce((acc, tutorial) => {
    const subject = tutorial.matiere || 'non-défini';
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {});
  
  // Calculer les tutoriels par mois
  const tutorialsByMonth = tutorials.reduce((acc, tutorial) => {
    if (tutorial.dateCreation) {
      const date = new Date(tutorial.dateCreation);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Calculer les tutoriels les plus vus
  const mostViewed = [...tutorials]
    .sort((a, b) => (b.vues || 0) - (a.vues || 0))
    .slice(0, 10)
    .map(tutorial => {
      // Ajouter des informations sur l'instructeur
      const instructeur = users.find(user => user.id === tutorial.instructeurId);
      return {
        ...tutorial,
        instructeurNom: instructeur ? `${instructeur.prenom} ${instructeur.nom}` : 'Inconnu'
      };
    });
  
  // Calculer le nombre total de vues
  const totalViews = tutorials.reduce((sum, tutorial) => sum + (tutorial.vues || 0), 0);
  
  // Calculer la moyenne des vues par tutoriel
  const averageViews = tutorials.length > 0 ? Math.round(totalViews / tutorials.length) : 0;
  
  // Calculer les tutoriels les plus récents
  const mostRecent = [...tutorials]
    .sort((a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0))
    .slice(0, 5)
    .map(tutorial => {
      const instructeur = users.find(user => user.id === tutorial.instructeurId);
      return {
        ...tutorial,
        instructeurNom: instructeur ? `${instructeur.prenom} ${instructeur.nom}` : 'Inconnu'
      };
    });
  
  return {
    total: tutorials.length,
    byLevel: levelCount,
    bySubject: subjectCount,
    tutorialsByMonth,
    mostViewed,
    totalViews,
    averageViews,
    mostRecent
  };
};

/**
 * Calcule les statistiques d'activité
 * @returns {Object} Statistiques d'activité
 */
const calculateActivityStatistics = () => {
  const logs = getActivityLogs();
  const users = getUsers();
  
  // Compter les actions par type
  const actionCount = logs.reduce((acc, log) => {
    const action = log.action || 'non-défini';
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});
  
  // Calculer les activités par jour
  const activitiesByDay = logs.reduce((acc, log) => {
    if (log.timestamp) {
      const date = new Date(log.timestamp);
      const dayMonthYear = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[dayMonthYear] = (acc[dayMonthYear] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Récupérer les activités récentes
  const recentActivity = [...logs]
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    .slice(0, 15)
    .map(log => {
      // Ajouter des informations sur l'utilisateur qui a effectué l'action
      const user = users.find(u => u.id === log.userId);
      return {
        ...log,
        userName: user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu'
      };
    });
  
  // Calculer l'activité par utilisateur
  const activityByUser = logs.reduce((acc, log) => {
    if (log.userId) {
      acc[log.userId] = (acc[log.userId] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Trouver les utilisateurs les plus actifs
  const mostActiveUsers = Object.entries(activityByUser)
    .map(([userId, count]) => {
      const user = users.find(u => u.id === userId);
      return {
        userId,
        userName: user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu',
        userRole: user ? user.role : 'inconnu',
        activityCount: count
      };
    })
    .sort((a, b) => b.activityCount - a.activityCount)
    .slice(0, 5);
  
  return {
    total: logs.length,
    byAction: actionCount,
    activitiesByDay,
    recentActivity,
    mostActiveUsers
  };
};

/**
 * Génère des statistiques complètes
 * @returns {Object} Statistiques complètes
 */
export const generateStatistics = () => {
  const userStats = calculateUserStatistics();
  const tutorialStats = calculateTutorialStatistics();
  const activityStats = calculateActivityStatistics();
  
  const statistics = {
    lastUpdated: new Date().toISOString(),
    users: userStats,
    tutorials: tutorialStats,
    activity: activityStats
  };
  
  // Sauvegarder les statistiques
  saveStatistics(statistics);
  
  return statistics;
};

/**
 * Récupère les statistiques actuelles ou génère de nouvelles si nécessaire
 * @param {boolean} forceRefresh - Forcer la régénération des statistiques
 * @returns {Object} Statistiques
 */
export const getOrGenerateStatistics = (forceRefresh = false) => {
  // Récupérer les statistiques existantes
  const existingStats = getStatistics();
  
  // Vérifier si les statistiques sont récentes (moins de 1 heure)
  const isRecent = existingStats && existingStats.lastUpdated && 
    (new Date() - new Date(existingStats.lastUpdated) < 3600000); // 1 heure en millisecondes
  
  // Si on force le rafraîchissement ou s'il n'y a pas de statistiques existantes ou si elles ne sont pas récentes
  if (forceRefresh || !existingStats || !isRecent) {
    // Générer de nouvelles statistiques
    const newStats = generateStatistics();
    return newStats;
  }
  
  return existingStats;
};
