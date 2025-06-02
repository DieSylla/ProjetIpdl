/**
 * Utilitaires de recherche basés sur l'algorithme TF-IDF
 * pour une recherche de vidéos plus intelligente et flexible
 */

/**
 * Calcule le score TF (Term Frequency) d'un terme dans un document
 * @param {string} term - Le terme à rechercher
 * @param {string} doc - Le document dans lequel chercher
 * @returns {number} - Le score TF
 */
export const calculateTF = (term, doc) => {
  if (!doc || doc.length === 0) return 0;
  
  const termLower = term.toLowerCase();
  const docLower = doc.toLowerCase();
  
  // Tokenisation simple du document (séparation par espaces et ponctuation)
  const words = docLower.match(/\w+/g) || [];
  
  // Compter les occurrences du terme
  const termCount = words.filter(word => word === termLower).length;
  
  // Calculer TF (nombre d'occurrences / nombre total de mots)
  return termCount / words.length;
};

/**
 * Calcule le score IDF (Inverse Document Frequency) d'un terme dans un corpus
 * @param {string} term - Le terme à évaluer
 * @param {Array<Object>} corpus - Le corpus de documents
 * @param {Function} extractText - Fonction pour extraire le texte d'un document
 * @returns {number} - Le score IDF
 */
export const calculateIDF = (term, corpus, extractText) => {
  if (!corpus || corpus.length === 0) return 0;
  
  const termLower = term.toLowerCase();
  
  // Compter le nombre de documents contenant le terme
  const docsWithTerm = corpus.filter(doc => {
    const text = extractText(doc).toLowerCase();
    return text.includes(termLower);
  }).length;
  
  // Éviter la division par zéro
  if (docsWithTerm === 0) return 0;
  
  // Calculer IDF (logarithme du nombre total de documents divisé par le nombre de documents contenant le terme)
  return Math.log(corpus.length / docsWithTerm);
};

/**
 * Calcule le score TF-IDF pour un terme dans un document par rapport à un corpus
 * @param {string} term - Le terme à évaluer
 * @param {Object} doc - Le document à évaluer
 * @param {Array<Object>} corpus - Le corpus de documents
 * @param {Function} extractText - Fonction pour extraire le texte d'un document
 * @returns {number} - Le score TF-IDF
 */
export const calculateTFIDF = (term, doc, corpus, extractText) => {
  const tf = calculateTF(term, extractText(doc));
  const idf = calculateIDF(term, corpus, extractText);
  
  return tf * idf;
};

/**
 * Calcule la similarité entre deux chaînes de caractères
 * Plus le score est élevé, plus les chaînes sont similaires
 * @param {string} str1 - Première chaîne
 * @param {string} str2 - Deuxième chaîne
 * @returns {number} - Score de similarité entre 0 et 1
 */
export const calculateStringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Correspondance exacte
  if (s1 === s2) return 1;
  
  // Vérifier si l'une est un préfixe de l'autre
  if (s1.startsWith(s2)) return 0.9;
  if (s2.startsWith(s1)) return 0.8;
  
  // Vérifier si l'une contient l'autre
  if (s1.includes(s2)) return 0.7;
  if (s2.includes(s1)) return 0.6;
  
  // Calculer la distance de Levenshtein (nombre minimal d'opérations pour transformer une chaîne en une autre)
  const matrix = [];
  
  // Initialiser la matrice
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  // Remplir la matrice
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1.charAt(i - 1) === s2.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Suppression
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }
  
  // Calculer la similarité normalisée (1 - distance/longueurMax)
  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);
  
  if (maxLength === 0) return 1.0; // Les deux chaînes sont vides
  
  return 1.0 - distance / maxLength;
};

/**
 * Recherche des vidéos dont le titre se rapproche de la requête
 * @param {string} query - La requête de recherche
 * @param {Array<Object>} videos - Le corpus de vidéos
 * @returns {Array<Object>} - Les vidéos triées par similarité de titre
 */
export const searchVideos = (query, videos) => {
  if (!query || query.trim() === '') return videos;
  
  const queryLower = query.toLowerCase().trim();
  
  // Calculer la similarité du titre pour chaque vidéo
  const scoredVideos = videos.map(video => {
    const titre = (video.titre || '').toLowerCase();
    const description = (video.description || '').toLowerCase();
    const matiere = (video.matiere || '').toLowerCase();
    
    // Calculer la similarité du titre avec la requête
    const titreSimilarity = calculateStringSimilarity(titre, queryLower);
    
    // Calculer la similarité de la description (moins importante que le titre)
    const descriptionSimilarity = calculateStringSimilarity(description, queryLower) * 0.5;
    
    // Calculer la similarité de la matière
    const matiereSimilarity = calculateStringSimilarity(matiere, queryLower) * 0.7;
    
    // Score combiné (le titre a plus de poids)
    const score = Math.max(titreSimilarity, descriptionSimilarity, matiereSimilarity);
    
    // Bonus pour les correspondances exactes ou les titres qui commencent par la requête
    if (titre === queryLower) {
      return { video, score: 1.0 }; // Correspondance exacte
    } else if (titre.startsWith(queryLower)) {
      return { video, score: 0.9 }; // Le titre commence par la requête
    }
    
    return { video, score };
  });
  
  // Filtrer les vidéos avec un score minimum et trier par score décroissant
  const threshold = 0.2; // Seuil minimal de similarité
  
  return scoredVideos
    .filter(item => item.score > threshold)
    .sort((a, b) => b.score - a.score)
    .map(item => item.video);
};

/**
 * Fonction utilitaire pour mettre en évidence les termes de recherche dans un texte
 * @param {string} text - Le texte à traiter
 * @param {string} query - La requête de recherche
 * @returns {string} - Le texte avec les termes mis en évidence (avec des balises <mark>)
 */
export const highlightSearchTerms = (text, query) => {
  if (!query || query.trim() === '' || !text) return text;
  
  const terms = query.toLowerCase().match(/\w+/g) || [];
  
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};

/**
 * Génère des suggestions de recherche basées sur les titres de vidéos
 * @param {string} partialQuery - La requête partielle
 * @param {Array<Object>} videos - Le corpus de vidéos
 * @param {number} limit - Nombre maximum de suggestions
 * @returns {Array<string>} - Liste de suggestions
 */
export const generateSearchSuggestions = (partialQuery, videos, limit = 5) => {
  if (!partialQuery || partialQuery.trim() === '') return [];
  
  const partialLower = partialQuery.toLowerCase().trim();
  const suggestions = [];
  
  // Trouver les titres qui contiennent la requête partielle
  videos.forEach(video => {
    if (video.titre) {
      const titre = video.titre.toLowerCase();
      
      // Ajouter le titre complet si celui-ci contient la requête partielle
      if (titre.includes(partialLower) && !suggestions.includes(video.titre)) {
        suggestions.push(video.titre);
      }
    }
    
    // Ajouter les matières qui correspondent à la requête
    if (video.matiere) {
      const matiere = video.matiere.toLowerCase();
      if (matiere.includes(partialLower) && !suggestions.includes(video.matiere)) {
        suggestions.push(video.matiere);
      }
    }
  });
  
  // Trier les suggestions par pertinence
  return suggestions
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      // Priorité aux titres qui commencent par la requête
      const aStartsWith = aLower.startsWith(partialLower);
      const bStartsWith = bLower.startsWith(partialLower);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Ensuite, priorité aux titres plus courts
      return a.length - b.length;
    })
    .slice(0, limit);
};
