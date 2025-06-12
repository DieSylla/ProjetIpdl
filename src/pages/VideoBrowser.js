import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { searchVideos, highlightSearchTerms, generateSearchSuggestions } from '../utils/searchUtils';
import '../style/videoBrowser.css';

const VideoBrowser = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [levels, setLevels] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    // Récupérer les vidéos depuis localStorage
    const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
    setVideos(tutoriels);
    
    // Extraire les niveaux uniques pour les filtres
    const uniqueLevels = [...new Set(tutoriels.map(video => video.niveau))];
    
    // S'assurer que tous les niveaux standard sont disponibles, même s'il n'y a pas encore de tutoriel avec ce niveau
    const standardLevels = ['Débutant', 'Intermédiaire', 'Avancé'];
    
    // Filtrer le niveau "Autre" du filtre de recherche
    const filteredLevels = uniqueLevels.filter(level => level !== 'Autre');
    
    // Combiner les niveaux standards avec les niveaux existants (sauf "Autre")
    const allLevels = [...new Set([...filteredLevels, ...standardLevels])];
    setLevels(allLevels);
    
    // Vérifier s'il y a des paramètres de recherche dans l'URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const filterParam = params.get('filter');
    const levelParam = params.get('level');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    if (levelParam) {
      setSelectedLevel(levelParam);
    }
    
    setLoading(false);
  }, [location.search]);
  
  // Appliquer les filtres lorsque les critères changent
  useEffect(() => {
    let result = videos;
    
    // Appliquer la recherche TF-IDF si un terme de recherche est présent
    if (searchTerm) {
      result = searchVideos(searchTerm, result);
    } else {
      // Filtres spéciaux
      const params = new URLSearchParams(location.search);
      const filterParam = params.get('filter');
      
      if (filterParam === 'recent') {
        // Trier par date de création (du plus récent au plus ancien)
        result = [...result].sort((a, b) => {
          return new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0);
        });
      } else if (filterParam === 'popular') {
        // Trier par nombre de vues (du plus vu au moins vu)
        result = [...result].sort((a, b) => (b.vues || 0) - (a.vues || 0));
      }
    }
    
    // Filtre par niveau
    if (selectedLevel) {
      result = result.filter(video => video.niveau === selectedLevel);
    }
    
    setFilteredVideos(result);
  }, [searchTerm, selectedLevel, videos, location.search]);
  
  // Générer des suggestions de recherche lorsque l'utilisateur tape
  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      const suggestions = generateSearchSuggestions(searchTerm, videos);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, videos]);
  
  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLevel('');
  };
  
  // Formater la durée
  const formatDuration = (duration) => {
    return duration;
  };
  
  // Formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };
  
  if (loading) return <div className="loading">Chargement des vidéos...</div>;
  
  return (
    <div className="video-browser">
      <div className="browser-header">
        <h1>Bibliothèque de vidéos</h1>
        <p>Découvrez nos tutoriels et ressources pédagogiques</p>
      </div>
      
      <div className="search-filters">
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Rechercher par titre, description, matière..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button className="search-button">
              <i className="fa-solid fa-search"></i>
            </button>
            
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => setSearchTerm(suggestion)}
                  >
                    <i className="fa-solid fa-search"></i> {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="filters">
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les niveaux</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          
          <button className="reset-button" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      </div>
      
      <div className="results-info">
        <p>{filteredVideos.length} vidéo(s) trouvée(s)</p>
      </div>
      
      {filteredVideos.length === 0 ? (
        <div className="no-results">
          <p>Aucune vidéo ne correspond à votre recherche.</p>
          <button className="reset-button" onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="videos-grid">
          {filteredVideos.map(video => (
            <Link to={`/videos/${video.id_tuto}`} key={video.id_tuto} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnailURL || '/placeholder-thumbnail.jpg'} alt={video.titre} />
                <span className="video-duration">{formatDuration(video.duree)}</span>
              </div>
              <div className="video-card-info">
                <h3 className="video-card-title">
                  {searchTerm ? (
                    <span dangerouslySetInnerHTML={{ 
                      __html: highlightSearchTerms(video.titre, searchTerm) 
                    }} />
                  ) : (
                    video.titre
                  )}
                </h3>
                <p className="video-card-author">{video.createur || 'Instructeur'}</p>
                <div className="video-card-meta">
                  <span className="video-card-views">{video.vues || 0} vues</span>
                  <span className="video-card-date">{formatDate(video.dateCreation)}</span>
                </div>
                <div className="video-card-tags">
                  <span className="video-card-subject">
                    {searchTerm && video.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightSearchTerms(video.matiere, searchTerm) 
                      }} />
                    ) : (
                      video.matiere
                    )}
                  </span>
                  <span className="video-card-level">{video.niveau}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoBrowser;
