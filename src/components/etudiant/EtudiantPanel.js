import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/etudiant/etudiantPanel.css';

/**
 * Composant principal de l'interface étudiant
 * Interface moderne similaire à celle de l'administrateur
 */
const EtudiantPanel = () => {
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [tutoriels, setTutoriels] = useState([]);
  const [favoris, setFavoris] = useState([]);
  
  // Hook de navigation
  const navigate = useNavigate();
  
  // Vérifier que l'utilisateur est bien un étudiant
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user || user.role !== 'etudiant') {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas étudiant
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Charger les tutoriels
    const savedTutoriels = localStorage.getItem('tutoriels');
    if (savedTutoriels) {
      setTutoriels(JSON.parse(savedTutoriels));
    }
    
    // Charger les favoris de l'étudiant
    const userFavoris = user.favoris || [];
    setFavoris(userFavoris);
  }, [navigate]);
  
  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Ajouter/Retirer un tutoriel des favoris
  const toggleFavorite = (tutorielId) => {
    const newFavoris = [...favoris];
    const index = newFavoris.indexOf(tutorielId);
    
    if (index === -1) {
      // Ajouter aux favoris
      newFavoris.push(tutorielId);
    } else {
      // Retirer des favoris
      newFavoris.splice(index, 1);
    }
    
    // Mettre à jour l'état local
    setFavoris(newFavoris);
    
    // Mettre à jour les favoris de l'utilisateur dans localStorage
    const user = { ...currentUser, favoris: newFavoris };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Mettre à jour la liste des utilisateurs dans localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  
  // Filtrer les tutoriels favoris
  const tutorielsFavoris = tutoriels.filter(tutoriel => favoris.includes(tutoriel.id));
  
  // Filtrer les tutoriels récents (derniers 7 jours)
  const tutorielsRecents = tutoriels.filter(tutoriel => {
    if (!tutoriel.dateCreation) return false;
    const dateCreation = new Date(tutoriel.dateCreation);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);
    return dateCreation >= dateLimit;
  });
  
  // Afficher le contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard">
            <h2>Tableau de Bord</h2>
            
            {/* Statistiques */}
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-video"></i>
                </div>
                <div className="stat-info">
                  <h3>Tutoriels disponibles</h3>
                  <div className="stat-value">{tutoriels.length}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="stat-info">
                  <h3>Tutoriels favoris</h3>
                  <div className="stat-value">{tutorielsFavoris.length}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>Tutoriels récents</h3>
                  <div className="stat-value">{tutorielsRecents.length}</div>
                </div>
              </div>
            </div>
            
            {/* Tutoriels récents */}
            <div className="recent-tutorials">
              <h3>Tutoriels récents</h3>
              {tutorielsRecents.length > 0 ? (
                <div className="tutorials-grid">
                  {tutorielsRecents.map(tutoriel => (
                    <div key={tutoriel.id} className="tutorial-card">
                      <div className="tutorial-thumbnail">
                        {tutoriel.thumbnail ? (
                          <img src={tutoriel.thumbnail} alt={tutoriel.titre} />
                        ) : (
                          <div className="placeholder-thumbnail">
                            <i className="fa-solid fa-video"></i>
                          </div>
                        )}
                      </div>
                      <div className="tutorial-info">
                        <h4>{tutoriel.titre}</h4>
                        <div className="tutorial-meta">
                          <span className="tutorial-subject">{tutoriel.matiere}</span>
                          <span className="tutorial-level">{tutoriel.niveau}</span>
                        </div>
                        <p className="tutorial-description">{tutoriel.description}</p>
                      </div>
                      <div className="tutorial-actions">
                        <button 
                          className="watch-button"
                          onClick={() => navigate(`/videos/${tutoriel.id}`)}
                        >
                          <i className="fa-solid fa-play"></i> Regarder
                        </button>
                        <button 
                          className={`favorite-button ${favoris.includes(tutoriel.id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(tutoriel.id)}
                        >
                          <i className={`fa-${favoris.includes(tutoriel.id) ? 'solid' : 'regular'} fa-heart`}></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">Aucun tutoriel récent disponible</div>
              )}
            </div>
          </div>
        );
      
      case 'tutorials':
        return (
          <div className="tutorials">
            <h2>Tous les Tutoriels</h2>
            
            {tutoriels.length > 0 ? (
              <div className="tutorials-grid">
                {tutoriels.map(tutoriel => (
                  <div key={tutoriel.id} className="tutorial-card">
                    <div className="tutorial-thumbnail">
                      {tutoriel.thumbnail ? (
                        <img src={tutoriel.thumbnail} alt={tutoriel.titre} />
                      ) : (
                        <div className="placeholder-thumbnail">
                          <i className="fa-solid fa-video"></i>
                        </div>
                      )}
                    </div>
                    <div className="tutorial-info">
                      <h4>{tutoriel.titre}</h4>
                      <div className="tutorial-meta">
                        <span className="tutorial-subject">{tutoriel.matiere}</span>
                        <span className="tutorial-level">{tutoriel.niveau}</span>
                      </div>
                      <p className="tutorial-description">{tutoriel.description}</p>
                    </div>
                    <div className="tutorial-actions">
                      <button 
                        className="watch-button"
                        onClick={() => navigate(`/videos/${tutoriel.id}`)}
                      >
                        <i className="fa-solid fa-play"></i> Regarder
                      </button>
                      <button 
                        className={`favorite-button ${favoris.includes(tutoriel.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(tutoriel.id)}
                      >
                        <i className={`fa-${favoris.includes(tutoriel.id) ? 'solid' : 'regular'} fa-heart`}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Aucun tutoriel disponible</div>
            )}
          </div>
        );
      
      case 'favorites':
        return (
          <div className="favorites">
            <h2>Mes Favoris</h2>
            
            {tutorielsFavoris.length > 0 ? (
              <div className="tutorials-grid">
                {tutorielsFavoris.map(tutoriel => (
                  <div key={tutoriel.id} className="tutorial-card">
                    <div className="tutorial-thumbnail">
                      {tutoriel.thumbnail ? (
                        <img src={tutoriel.thumbnail} alt={tutoriel.titre} />
                      ) : (
                        <div className="placeholder-thumbnail">
                          <i className="fa-solid fa-video"></i>
                        </div>
                      )}
                    </div>
                    <div className="tutorial-info">
                      <h4>{tutoriel.titre}</h4>
                      <div className="tutorial-meta">
                        <span className="tutorial-subject">{tutoriel.matiere}</span>
                        <span className="tutorial-level">{tutoriel.niveau}</span>
                      </div>
                      <p className="tutorial-description">{tutoriel.description}</p>
                    </div>
                    <div className="tutorial-actions">
                      <button 
                        className="watch-button"
                        onClick={() => navigate(`/videos/${tutoriel.id}`)}
                      >
                        <i className="fa-solid fa-play"></i> Regarder
                      </button>
                      <button 
                        className="favorite-button active"
                        onClick={() => toggleFavorite(tutoriel.id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Aucun tutoriel favori</div>
            )}
          </div>
        );
      
      case 'profile':
        return (
          <div className="profile">
            <h2>Mon Profil</h2>
            
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <i className="fa-solid fa-user-graduate"></i>
                </div>
                <div className="profile-info">
                  <h3>{currentUser?.prenom} {currentUser?.nom}</h3>
                  <p className="profile-email">{currentUser?.email}</p>
                  <p className="profile-role">Étudiant</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="profile-section">
                  <h4>Informations personnelles</h4>
                  <div className="profile-field">
                    <span className="field-label">Nom complet:</span>
                    <span className="field-value">{currentUser?.prenom} {currentUser?.nom}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{currentUser?.email}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Date d'inscription:</span>
                    <span className="field-value">{formatDate(currentUser?.dateCreation)}</span>
                  </div>
                </div>
                
                <div className="profile-section">
                  <h4>Statistiques</h4>
                  <div className="profile-field">
                    <span className="field-label">Tutoriels favoris:</span>
                    <span className="field-value">{favoris.length}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Dernière connexion:</span>
                    <span className="field-value">{formatDate(currentUser?.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Contenu non disponible</div>;
    }
  };
  
  return (
    <div className="etudiant-panel">
      {/* Barre latérale */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Espace Étudiant</h1>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fa-solid fa-gauge-high"></i>
            <span>Tableau de bord</span>
          </button>
          
          <button 
            className={`sidebar-item ${activeTab === 'tutorials' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorials')}
          >
            <i className="fa-solid fa-video"></i>
            <span>Tutoriels</span>
          </button>
          
          <button 
            className={`sidebar-item ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="fa-solid fa-heart"></i>
            <span>Favoris</span>
          </button>
          
          <button 
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-user"></i>
            <span>Mon profil</span>
          </button>
        </div>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="main-content">
        {/* En-tête */}
        <div className="header">
          <div className="header-title">
            {activeTab === 'dashboard' && 'Tableau de bord'}
            {activeTab === 'tutorials' && 'Tutoriels'}
            {activeTab === 'favorites' && 'Mes favoris'}
            {activeTab === 'profile' && 'Mon profil'}
          </div>
          
          <div className="user-info">
            {currentUser && (
              <>
                <div className="user-name">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="user-role">Étudiant</div>
                <div className="user-avatar">
                  <i className="fa-solid fa-user-graduate"></i>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Contenu de l'onglet actif */}
        <div className="tab-content">
          {renderContent()}
        </div>
        
        {/* Pied de page */}
        <div className="footer">
          <div className="footer-info">
            <p>Connecté en tant que {currentUser?.prenom} {currentUser?.nom}</p>
            <p>Dernière connexion: {formatDate(currentUser?.lastLogin)}</p>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} - Plateforme de Tutoriels IPDL
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtudiantPanel;
