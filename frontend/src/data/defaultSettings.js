/**
 * Paramètres système par défaut pour l'application
 * Ces paramètres seront utilisés pour initialiser la configuration
 * si aucun paramètre n'existe déjà.
 */

export const defaultSettings = {
  // Paramètres généraux
  siteName: 'Système de Recommandation Vidéo',
  siteDescription: 'Plateforme d\'apprentissage en ligne avec des vidéos éducatives',
  
  // Paramètres utilisateur
  defaultUserRole: 'etudiant',
  allowRegistration: true,
  requireEmailVerification: false,
  passwordMinLength: 6,
  
  // Paramètres instructeur
  maxTutorialsPerInstructor: 50,
  requireTutorialApproval: false,
  
  // Paramètres tutoriel
  allowComments: true,
  moderationEnabled: false,
  
  // Paramètres de contenu
  allowedVideoFormats: ['mp4', 'webm', 'ogg'],
  maxVideoSize: 500, // en MB
  
  // Niveaux disponibles
  availableLevels: ['Débutant', 'Intermédiaire', 'Avancé', 'Autre'],
  
  // Date de dernière mise à jour
  lastUpdated: new Date().toISOString()
};
