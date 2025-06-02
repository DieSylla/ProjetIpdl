import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/videoPlayer.css';
import { calculateTFIDF, searchVideos, highlightSearchTerms } from '../utils/searchUtils';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fonction pour extraire le texte d'une vidéo pour l'algorithme TF-IDF
  const extractVideoText = (video) => {
    if (!video) return '';
    
    // Concaténer toutes les informations textuelles de la vidéo
    return [
      video.titre || '',
      video.description || '',
      video.matiere || '',
      video.niveau || '',
      video.instructeurNom || ''
    ].join(' ');
  };
  
  // Fonction pour calculer la similarité entre deux vidéos avec TF-IDF
  const calculateVideoSimilarity = (videoA, videoB, allVideos) => {
    if (!videoA || !videoB) return 0;
    
    // Score de base pour les correspondances exactes
    let score = 0;
    
    // Même matière (facteur le plus important)
    if (videoA.matiere === videoB.matiere) score += 5;
    
    // Même niveau
    if (videoA.niveau === videoB.niveau) score += 3;
    
    // Même instructeur
    if (videoA.instructeurId === videoB.instructeurId) score += 2;
    
    // Utiliser TF-IDF pour les mots significatifs du titre et de la description
    const titleWords = (videoA.titre || '').toLowerCase().split(/\s+/).filter(word => word.length > 3);
    
    // Calculer le score TF-IDF pour chaque mot significatif
    const tfidfScores = titleWords.map(word => {
      return calculateTFIDF(word, videoB, allVideos, extractVideoText);
    });
    
    // Ajouter le score TF-IDF moyen au score total
    if (tfidfScores.length > 0) {
      const avgTfidf = tfidfScores.reduce((sum, score) => sum + score, 0) / tfidfScores.length;
      score += avgTfidf * 10; // Multiplier pour donner plus de poids au TF-IDF
    }
    
    return score;
  };
  
  // Récupérer les données de la vidéo et des commentaires
  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    // Récupérer la vidéo
    const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
    
    // Rechercher la vidéo par différents identifiants possibles (id_tuto ou id)
    const foundVideo = tutoriels.find(tuto => {
      if (!tuto) return false;
      
      // Vérifier les différents formats d'ID possibles
      if (tuto.id_tuto && tuto.id_tuto.toString() === id) return true;
      if (tuto.id && tuto.id.toString() === id) return true;
      
      return false;
    });
    
    if (foundVideo) {
      console.log('Vidéo trouvée:', foundVideo);
      setVideo(foundVideo);
      
      // Incrémenter le nombre de vues
      const updatedTutoriels = tutoriels.map(tuto => {
        // Vérifier les différents formats d'ID possibles
        const matchesId = 
          (tuto && tuto.id_tuto && tuto.id_tuto.toString() === id) ||
          (tuto && tuto.id && tuto.id.toString() === id);
          
        if (matchesId) {
          return { ...tuto, vues: (tuto.vues || 0) + 1 };
        }
        return tuto;
      });
      
      localStorage.setItem('tutoriels', JSON.stringify(updatedTutoriels));
      
      // Récupérer les commentaires
      const allComments = JSON.parse(localStorage.getItem('comments')) || [];
      const videoComments = allComments.filter(comment => comment && comment.videoId === id);
      setComments(videoComments);
      
      // Récupérer la progression de lecture
      const userHistory = JSON.parse(localStorage.getItem(`userHistory_${currentUser.email}`)) || { watched: [] };
      const watchedVideo = userHistory.watched.find(item => item && item.videoId === id);
      if (watchedVideo && watchedVideo.progress) {
        setProgress(watchedVideo.progress);
      }
      
      // Récupérer des vidéos similaires en utilisant l'algorithme TF-IDF
      const otherTutoriels = tutoriels.filter(tuto => 
        tuto && 
        ((tuto.id_tuto && tuto.id_tuto.toString() !== id) || 
         (tuto.id && tuto.id.toString() !== id))
      );
      
      // Calculer le score de similarité pour chaque vidéo avec TF-IDF
      const scoredTutoriels = otherTutoriels.map(tuto => ({
        ...tuto,
        similarityScore: calculateVideoSimilarity(foundVideo, tuto, tutoriels)
      }));
      
      // Trier par score de similarité décroissant
      const sortedSimilarTutoriels = scoredTutoriels
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 8); // Afficher plus de vidéos similaires
      
      console.log('Vidéos similaires avec TF-IDF:', sortedSimilarTutoriels);
      setSimilarVideos(sortedSimilarTutoriels);
    } else {
      console.error('Vidéo non trouvée pour ID:', id);
      console.log('Tutoriels disponibles:', tutoriels);
      setError('Vidéo non trouvée');
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  // Gérer le chargement des métadonnées de la vidéo
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      // Mettre à jour la durée totale de la vidéo
      setDuration(videoRef.current.duration);
      
      // Charger la progression sauvegardée si elle existe
      const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
      const watchedVideo = watchedVideos.find(v => 
        (v.id === id || v.id === video.id || v.id === video.id_tuto)
      );
      
      if (watchedVideo && watchedVideo.progress) {
        videoRef.current.currentTime = watchedVideo.progress;
        setProgress((watchedVideo.progress / videoRef.current.duration) * 100);
      }
      
      console.log('Vidéo chargée avec succès:', {
        durée: videoRef.current.duration,
        source: videoRef.current.src
      });
    }
  };
  
  // Gérer la progression de la lecture
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      // Mettre à jour le temps actuel
      setCurrentTime(current);
      
      // Calculer la progression en pourcentage
      const progressPercent = (current / duration) * 100;
      setProgress(progressPercent);
      
      // Mettre à jour la progression dans l'historique de l'utilisateur
      if (user) {
        const userHistory = JSON.parse(localStorage.getItem(`userHistory_${user.email}`)) || { watched: [] };
        
        // Trouver si cette vidéo est déjà dans l'historique
        const videoIndex = userHistory.watched.findIndex(item => item.videoId === id);
        
        if (videoIndex >= 0) {
          // Mettre à jour la progression
          userHistory.watched[videoIndex].progress = current;
          userHistory.watched[videoIndex].lastWatched = new Date().toISOString();
        } else {
          // Ajouter une nouvelle entrée
          userHistory.watched.push({
            videoId: id,
            title: video.titre,
            progress: current,
            lastWatched: new Date().toISOString()
          });
        }
        
        localStorage.setItem(`userHistory_${user.email}`, JSON.stringify(userHistory));
      }
    }
  };
  
  // Gérer la soumission d'un nouveau commentaire
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      videoId: id,
      userId: user.email,
      userName: `${user.prenom} ${user.nom}`,
      content: newComment,
      timestamp: Date.now(),
      likes: 0,
      parentId: null,
      replies: []
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    
    // Sauvegarder dans localStorage
    const allComments = JSON.parse(localStorage.getItem('comments')) || [];
    localStorage.setItem('comments', JSON.stringify([...allComments, comment]));
    
    // Réinitialiser le formulaire
    setNewComment('');
  };
  
  // Gérer les contrôles de lecture
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      if (videoRef.current.volume === 0) {
        videoRef.current.volume = volume || 0.5;
      } else {
        videoRef.current.volume = 0;
      }
      setVolume(videoRef.current.volume);
    }
  };
  
  const handleSeek = (e) => {
    const seekValue = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(seekValue)) {
      const seekTime = (seekValue / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(seekValue);
    }
  };
  
  // Fonction pour activer/désactiver le mode plein écran
  const toggleFullScreen = () => {
    const videoContainer = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) { /* IE11 */
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };
  
  // Formater le temps (secondes -> MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Formater la date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Rechercher des vidéos avec l'algorithme TF-IDF
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Si la recherche est vide, afficher les vidéos similaires
    if (!searchQuery.trim()) {
      // Récupérer des vidéos similaires en fonction de TF-IDF
      const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
      const otherTutoriels = tutoriels.filter(tuto => 
        tuto && 
        ((tuto.id_tuto && tuto.id_tuto.toString() !== id) || 
         (tuto.id && tuto.id.toString() !== id))
      );
      
      // Calculer le score de similarité pour chaque vidéo avec TF-IDF
      const scoredTutoriels = otherTutoriels.map(tuto => ({
        ...tuto,
        similarityScore: calculateVideoSimilarity(video, tuto, tutoriels)
      }));
      
      // Trier par score de similarité décroissant
      const sortedSimilarTutoriels = scoredTutoriels
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 8);
      
      setSimilarVideos(sortedSimilarTutoriels);
      return;
    }
    
    // Utiliser la fonction searchVideos de searchUtils.js qui implémente TF-IDF
    const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
    
    // Recherche avec l'algorithme TF-IDF
    const searchResults = searchVideos(searchQuery, tutoriels);
    
    // Ajouter des propriétés pour l'affichage des résultats
    const enhancedResults = searchResults.map(result => {
      // Mettre en évidence les termes de recherche dans le titre
      const highlightedTitle = highlightSearchTerms(result.video.titre || '', searchQuery);
      
      return {
        ...result.video,
        searchScore: result.score,
        highlightedTitle: highlightedTitle,
        // Ajouter d'autres propriétés si nécessaire
      };
    });
    
    console.log('Résultats de recherche TF-IDF:', enhancedResults);
    setSimilarVideos(enhancedResults);
  };
  
  // Fonction pour mettre à jour le compteur de vues d'une vidéo
  const updateViews = (videoToUpdate) => {
    if (!videoToUpdate) return;
    
    // Récupérer toutes les vidéos
    const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
    
    // Trouver l'index de la vidéo à mettre à jour
    const videoIndex = tutoriels.findIndex(tuto => 
      (tuto.id_tuto && videoToUpdate.id_tuto && tuto.id_tuto.toString() === videoToUpdate.id_tuto.toString()) ||
      (tuto.id && videoToUpdate.id && tuto.id.toString() === videoToUpdate.id.toString())
    );
    
    if (videoIndex >= 0) {
      // Incrémenter le compteur de vues
      tutoriels[videoIndex].vues = (parseInt(tutoriels[videoIndex].vues || 0) + 1).toString();
      
      // Mettre à jour le localStorage
      localStorage.setItem('tutoriels', JSON.stringify(tutoriels));
      
      // Mettre à jour l'objet vidéo actuel si c'est la même
      if (video && 
          ((video.id_tuto && videoToUpdate.id_tuto && video.id_tuto.toString() === videoToUpdate.id_tuto.toString()) ||
           (video.id && videoToUpdate.id && video.id.toString() === videoToUpdate.id.toString()))) {
        setVideo(prev => ({ ...prev, vues: tutoriels[videoIndex].vues }));
      }
    }
  };
  
  // Naviguer vers une autre vidéo (remplacer la vidéo en cours de lecture)
  const navigateToVideo = (videoId) => {
    if (!videoId) return;
    
    // Sauvegarder la progression de la vidéo actuelle avant de changer
    if (video && videoRef.current) {
      const currentProgress = videoRef.current.currentTime;
      const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
      
      // Trouver si cette vidéo a déjà été regardée
      const videoIndex = watchedVideos.findIndex(v => 
        (v.id === id || v.id === video.id || v.id === video.id_tuto)
      );
      
      if (videoIndex >= 0) {
        // Mettre à jour la progression
        watchedVideos[videoIndex].progress = currentProgress;
        watchedVideos[videoIndex].lastWatched = new Date().toISOString();
      } else {
        // Ajouter une nouvelle entrée
        watchedVideos.push({
          id: id || video.id || video.id_tuto,
          titre: video.titre,
          progress: currentProgress,
          lastWatched: new Date().toISOString()
        });
      }
      
      localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
    }
    
    // Trouver la nouvelle vidéo
    const tutoriels = JSON.parse(localStorage.getItem('tutoriels')) || [];
    const newVideo = tutoriels.find(tuto => 
      (tuto.id_tuto && tuto.id_tuto.toString() === videoId.toString()) || 
      (tuto.id && tuto.id.toString() === videoId.toString())
    );
    
    if (newVideo) {
      // Mettre à jour l'URL sans recharger la page
      window.history.pushState({}, '', `/video/${videoId}`);
      
      // Mettre à jour l'état sans utiliser setId
      setVideo({...newVideo, id_tuto: videoId});
      setIsPlaying(false);
      
      // Réinitialiser le lecteur vidéo
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        
        // Mettre à jour la source vidéo
        const videoSrc = newVideo.videoUrl || newVideo.videoFile || newVideo.video;
        if (videoSrc) {
          videoRef.current.src = videoSrc;
          videoRef.current.load();
        }
      }
      
      // Mettre à jour les commentaires
      const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
      const videoComments = allComments.filter(comment => 
        comment.videoId === videoId.toString() || 
        comment.videoId === newVideo.id?.toString() || 
        comment.videoId === newVideo.id_tuto?.toString()
      );
      setComments(videoComments);
      
      // Mettre à jour les vidéos similaires
      const otherTutoriels = tutoriels.filter(tuto => 
        tuto && 
        ((tuto.id_tuto && tuto.id_tuto.toString() !== videoId.toString()) || 
         (tuto.id && tuto.id.toString() !== videoId.toString()))
      );
      
      const scoredTutoriels = otherTutoriels.map(tuto => ({
        ...tuto,
        similarityScore: calculateVideoSimilarity(newVideo, tuto, tutoriels)
      }));
      
      const sortedSimilarTutoriels = scoredTutoriels
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 8);
      
      setSimilarVideos(sortedSimilarTutoriels);
      
      // Mettre à jour les vues
      updateViews(newVideo);
      
      // Faire défiler vers le haut
      window.scrollTo(0, 0);
    } else {
      // Si la vidéo n'est pas trouvée, utiliser la navigation standard
      navigate(`/video/${videoId}`);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!video) return <div className="error">Vidéo non trouvée</div>;

  return (
    <div className="video-player-page">
      <div className="main-container">
        <div className="video-content">
          <div className="video-container">
            <video
              ref={videoRef}
              src={video.videoURL || video.videoUrl || video.videoFile || video.video}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedMetadata={handleLoadedMetadata}
              poster={video.thumbnailURL || video.thumbnail}
              className="main-video"
              controls={false}
            />
            
            <div className="video-controls">
              <button className="play-button" onClick={togglePlay}>
                {isPlaying ? 
                  <i className="fa-solid fa-pause"></i> : 
                  <i className="fa-solid fa-play"></i>
                }
              </button>
              
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="progress-bar"
              />
              
              <div className="volume-control">
                <button className="volume-button" onClick={toggleMute}>
                  {volume === 0 ? 
                    <i className="fa-solid fa-volume-mute"></i> : 
                    <i className="fa-solid fa-volume-high"></i>
                  }
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              
              <button className="fullscreen-button" onClick={toggleFullScreen}>
                <i className="fa-solid fa-expand"></i>
              </button>
            </div>
          </div>
          
          <div className="video-info">
            <h1 className="video-title">{video.titre}</h1>
            
            <div className="video-meta">
              <div className="video-views">
                <i className="fa-solid fa-eye"></i>
                <span>{video.vues || 0} vues</span>
              </div>
              
              <div className="video-date">
                <i className="fa-solid fa-calendar"></i>
                <span>{formatDate(video.dateCreation)}</span>
              </div>
              
              <div className="video-author">
                <i className="fa-solid fa-user"></i>
                <span>{video.instructeurNom || 'Instructeur'}</span>
              </div>
            </div>
            
            <div className="video-description">
              {video.description}
            </div>
            
            <div className="video-tags">
              <span className="video-tag">{video.matiere}</span>
              <span className="video-tag">{video.niveau}</span>
            </div>
          </div>
          
          <div className="comments-section">
            <h3>Commentaires ({comments.length})</h3>
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                required
              ></textarea>
              <button type="submit">Commenter</button>
            </form>
            
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <div className="comment-author">{comment.userName}</div>
                      <div className="comment-date">{formatDate(comment.timestamp)}</div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              ) : (
                <div className="no-comments">Aucun commentaire pour le moment</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="video-suggestions">
          <h3>Vidéos recommandées</h3>
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Rechercher des tutoriels..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fa-solid fa-search"></i>
            </button>
          </form>
          
          <div className="suggested-videos">
            {similarVideos.length > 0 ? (
              similarVideos.map(video => (
                <div 
                  key={video.id || video.id_tuto} 
                  className="suggested-video"
                  onClick={() => navigateToVideo(video.id || video.id_tuto)}
                >
                  <div className="suggested-thumbnail">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.titre} />
                    ) : (
                      <div className="placeholder-thumbnail">
                        <i className="fa-solid fa-video"></i>
                      </div>
                    )}
                    <div className="video-duration">{video.duree || '00:00'}</div>
                  </div>
                  <div className="suggested-info">
                    <div className="suggested-title">
                      {video.highlightedTitle ? (
                        <span dangerouslySetInnerHTML={{ __html: video.highlightedTitle }} />
                      ) : (
                        video.titre
                      )}
                    </div>
                    <div className="suggested-meta">
                      <div className="suggested-author">{video.instructeurNom || 'Instructeur'}</div>
                      <div className="suggested-views"><i className="fa-solid fa-eye"></i> {video.vues || 0}</div>
                    </div>
                    <div className="suggested-tags">
                      <span className="suggested-tag">{video.matiere}</span>
                      <span className="suggested-tag">{video.niveau}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-suggestions">
                <i className="fa-solid fa-search"></i>
                <p>Aucun résultat trouvé</p>
                <p>Essayez d'autres mots-clés</p>
              </div>
            )}
          </div>
          
          {searchQuery && similarVideos.length > 0 && (
            <div className="search-results-info">
              <p>{similarVideos.length} résultat(s) trouvé(s) pour "{searchQuery}"</p>
              <button 
                className="clear-search" 
                onClick={() => {
                  setSearchQuery('');
                  handleSearch({ preventDefault: () => {} });
                }}
              >
                <i className="fa-solid fa-times"></i> Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
