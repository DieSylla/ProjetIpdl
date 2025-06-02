import React from 'react';
import { Link } from 'react-router-dom';
import '../../style/components/videoCard.css';

const VideoCard = ({ video }) => {
  // Formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  return (
    <Link to={`/videos/${video.id_tuto}`} className="video-card">
      <div className="video-thumbnail">
        <img 
          src={video.thumbnailURL || '/placeholder-thumbnail.jpg'} 
          alt={video.titre} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-thumbnail.jpg';
          }}
        />
        <span className="video-duration">{video.duree}</span>
      </div>
      <div className="video-card-info">
        <h3 className="video-card-title">{video.titre}</h3>
        <p className="video-card-author">{video.createur || 'Instructeur'}</p>
        <div className="video-card-meta">
          <span className="video-card-views">{video.vues || 0} vues</span>
          <span className="video-card-date">{formatDate(video.dateCreation)}</span>
        </div>
        <div className="video-card-tags">
          <span className="video-card-subject">{video.matiere}</span>
          <span className={`video-card-level niveau-${video.niveau === 'Débutant' ? 'debutant' : 
                            video.niveau === 'Intermédiaire' ? 'intermediaire' : 
                            video.niveau === 'Avancé' ? 'avance' : 
                            video.niveau === 'Autre' ? 'autre' : ''}`}>
            {video.niveau}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
