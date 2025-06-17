// Utilitaire pour gérer le stockage des images de profil avec IndexedDB
const DB_NAME = 'ProfilImagesDB';
const DB_VERSION = 1;
const STORE_NAME = 'profileImages';

// Initialisation de la base de données
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Erreur lors de l\'ouverture de la base de données');
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Créer un object store pour les images de profil
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'email' });
      }
    };
  });
};

// Sauvegarder une image de profil
export const saveProfileImage = async (email, imageData) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.put({ email, imageData, timestamp: Date.now() });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject('Erreur lors de la sauvegarde de l\'image');
    });
  } catch (error) {
    console.error('Erreur IndexedDB:', error);
    return false;
  }
};

// Récupérer une image de profil
export const getProfileImage = async (email) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.get(email);
      
      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result ? result.imageData : null);
      };
      
      request.onerror = () => reject('Erreur lors de la récupération de l\'image');
    });
  } catch (error) {
    console.error('Erreur IndexedDB:', error);
    return null;
  }
};

// Supprimer une image de profil
export const deleteProfileImage = async (email) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const request = store.delete(email);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject('Erreur lors de la suppression de l\'image');
    });
  } catch (error) {
    console.error('Erreur IndexedDB:', error);
    return false;
  }
};

// Vérifier si une image existe
export const hasProfileImage = async (email) => {
  try {
    const imageData = await getProfileImage(email);
    return !!imageData;
  } catch (error) {
    return false;
  }
};
