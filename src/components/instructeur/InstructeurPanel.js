import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/instructeur/instructeurPanel.css';

/**
 * Composant principal de l'interface instructeur
 * Interface moderne similaire à celle de l'administrateur
 */
const InstructeurPanel = () => {
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [tutoriels, setTutoriels] = useState([]);
  const [showTutorialForm, setShowTutorialForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTutorialId, setEditTutorialId] = useState(null);
  
  // État pour le formulaire de tutoriel
  const [tutorialData, setTutorialData] = useState({
    titre: '',
    description: '',
    matiere: '',
    duree: '',
    niveau: 'Débutant',
    fichier: null,
    thumbnail: null
  });
  
  // Prévisualisations
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Références pour les inputs de fichiers
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  
  // Hook de navigation
  const navigate = useNavigate();
  
  // Vérifier que l'utilisateur est bien un instructeur
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user || user.role !== 'instructeur') {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas instructeur
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Charger les tutoriels
    const savedTutoriels = localStorage.getItem('tutoriels');
    if (savedTutoriels) {
      const allTutoriels = JSON.parse(savedTutoriels);
      // Filtrer pour n'afficher que les tutoriels de cet instructeur
      const instructeurTutoriels = allTutoriels.filter(
        tutoriel => tutoriel.instructeurId === user.id
      );
      setTutoriels(instructeurTutoriels);
    }
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
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTutorialData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gérer le changement de fichier vidéo
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTutorialData(prev => ({ ...prev, fichier: file }));
      
      // Créer une URL pour la prévisualisation
      const fileURL = URL.createObjectURL(file);
      setVideoPreview(fileURL);
    }
  };
  
  // Gérer le changement de miniature
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTutorialData(prev => ({ ...prev, thumbnail: file }));
      
      // Créer une URL pour la prévisualisation
      const fileURL = URL.createObjectURL(file);
      setThumbnailPreview(fileURL);
    }
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setTutorialData({
      titre: '',
      description: '',
      matiere: '',
      duree: '',
      niveau: 'Débutant',
      fichier: null,
      thumbnail: null
    });
    setVideoPreview(null);
    setThumbnailPreview(null);
    setEditMode(false);
    setEditTutorialId(null);
    
    // Réinitialiser les inputs de fichiers
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };
  
  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que les champs obligatoires sont remplis
    if (!tutorialData.titre || !tutorialData.matiere || !tutorialData.niveau) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Récupérer tous les tutoriels
    const allTutoriels = JSON.parse(localStorage.getItem('tutoriels') || '[]');
    
    if (editMode && editTutorialId) {
      // Mode édition - mettre à jour un tutoriel existant
      const tutorialIndex = allTutoriels.findIndex(t => t.id === editTutorialId);
      
      if (tutorialIndex !== -1) {
        // Convertir les fichiers en URL de données si nécessaire
        const processFiles = async () => {
          let videoUrl = allTutoriels[tutorialIndex].videoUrl;
          let thumbnailUrl = allTutoriels[tutorialIndex].thumbnail;
          
          // Traiter le fichier vidéo s'il a été modifié - utiliser isVideo=true
          if (tutorialData.fichier && tutorialData.fichier instanceof File) {
            videoUrl = await readFileAsDataURL(tutorialData.fichier, true);
          }
          
          // Traiter la miniature si elle a été modifiée
          if (tutorialData.thumbnail && tutorialData.thumbnail instanceof File) {
            thumbnailUrl = await readFileAsDataURL(tutorialData.thumbnail);
          }
          
          // Mettre à jour le tutoriel
          const updatedTutorial = {
            ...allTutoriels[tutorialIndex],
            titre: tutorialData.titre,
            description: tutorialData.description,
            matiere: tutorialData.matiere,
            duree: tutorialData.duree,
            niveau: tutorialData.niveau,
            videoUrl,
            thumbnail: thumbnailUrl,
            dateModification: new Date().toISOString()
          };
          
          // Mettre à jour le tableau de tutoriels
          allTutoriels[tutorialIndex] = updatedTutorial;
          localStorage.setItem('tutoriels', JSON.stringify(allTutoriels));
          
          // Mettre à jour l'état local
          setTutoriels(prevTutoriels => 
            prevTutoriels.map(t => t.id === editTutorialId ? updatedTutorial : t)
          );
          
          // Réinitialiser le formulaire
          resetForm();
          setShowTutorialForm(false);
        };
        
        processFiles();
      }
    } else {
      // Mode ajout - créer un nouveau tutoriel
      const processFiles = async () => {
        let videoUrl = '';
        let thumbnailUrl = '';
        
        // Traiter le fichier vidéo - utiliser isVideo=true pour créer une URL d'objet
        if (tutorialData.fichier && tutorialData.fichier instanceof File) {
          videoUrl = await readFileAsDataURL(tutorialData.fichier, true);
        }
        
        // Traiter la miniature - utiliser isVideo=false (par défaut) pour le base64
        if (tutorialData.thumbnail && tutorialData.thumbnail instanceof File) {
          thumbnailUrl = await readFileAsDataURL(tutorialData.thumbnail);
        }
        
        // Créer le nouveau tutoriel
        const newTutorial = {
          id: Date.now().toString(),
          titre: tutorialData.titre,
          description: tutorialData.description,
          matiere: tutorialData.matiere,
          duree: tutorialData.duree,
          niveau: tutorialData.niveau,
          videoUrl,
          thumbnail: thumbnailUrl,
          instructeurId: currentUser.id,
          instructeurNom: `${currentUser.prenom} ${currentUser.nom}`,
          dateCreation: new Date().toISOString(),
          vues: 0
        };
        
        // Ajouter le tutoriel à la liste
        const updatedTutoriels = [...allTutoriels, newTutorial];
        localStorage.setItem('tutoriels', JSON.stringify(updatedTutoriels));
        
        // Mettre à jour l'état local
        setTutoriels(prevTutoriels => [...prevTutoriels, newTutorial]);
        
        // Réinitialiser le formulaire
        resetForm();
        setShowTutorialForm(false);
      };
      
      processFiles();
    }
  };
  
  // Lire un fichier comme une URL de données
  // Pour les vidéos, nous utilisons une URL d'objet au lieu de base64 pour éviter de dépasser la limite du localStorage
  const readFileAsDataURL = (file, isVideo = false) => {
    return new Promise((resolve, reject) => {
      if (isVideo) {
        // Pour les vidéos, utiliser une URL d'objet (blob URL) pour économiser de l'espace
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      } else {
        // Pour les images, continuer à utiliser le base64
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }
    });
  };
  
  // Éditer un tutoriel
  const handleEdit = (tutoriel) => {
    setTutorialData({
      titre: tutoriel.titre,
      description: tutoriel.description || '',
      matiere: tutoriel.matiere || '',
      duree: tutoriel.duree || '',
      niveau: tutoriel.niveau || 'Débutant',
      fichier: null,
      thumbnail: null
    });
    
    setVideoPreview(tutoriel.videoUrl);
    setThumbnailPreview(tutoriel.thumbnail);
    setEditMode(true);
    setEditTutorialId(tutoriel.id);
    setShowTutorialForm(true);
    setActiveTab('tutorials');
  };
  
  // Supprimer un tutoriel
  const handleDelete = (tutorielId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tutoriel ?')) {
      // Récupérer tous les tutoriels
      const allTutoriels = JSON.parse(localStorage.getItem('tutoriels') || '[]');
      
      // Filtrer pour retirer le tutoriel à supprimer
      const updatedTutoriels = allTutoriels.filter(t => t.id !== tutorielId);
      
      // Mettre à jour localStorage
      localStorage.setItem('tutoriels', JSON.stringify(updatedTutoriels));
      
      // Mettre à jour l'état local
      setTutoriels(prevTutoriels => prevTutoriels.filter(t => t.id !== tutorielId));
    }
  };
  
  // Calculer les statistiques
  const tutorielsCount = tutoriels.length;
  const totalViews = tutoriels.reduce((sum, tutoriel) => sum + (tutoriel.vues || 0), 0);
  const averageViews = tutorielsCount > 0 ? Math.round(totalViews / tutorielsCount) : 0;
  
  // Tutoriels les plus vus
  const topTutoriels = [...tutoriels]
    .sort((a, b) => (b.vues || 0) - (a.vues || 0))
    .slice(0, 5);
  
  // Tutoriels récents
  const recentTutoriels = [...tutoriels]
    .sort((a, b) => new Date(b.dateCreation || 0) - new Date(a.dateCreation || 0))
    .slice(0, 5);
  
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
                  <h3>Tutoriels publiés</h3>
                  <div className="stat-value">{tutorielsCount}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-eye"></i>
                </div>
                <div className="stat-info">
                  <h3>Vues totales</h3>
                  <div className="stat-value">{totalViews}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <h3>Vues moyennes</h3>
                  <div className="stat-value">{averageViews}</div>
                </div>
              </div>
            </div>
            
            {/* Tutoriels les plus populaires */}
            <div className="popular-tutorials">
              <h3>Tutoriels les plus populaires</h3>
              {topTutoriels.length > 0 ? (
                <div className="tutorials-list">
                  {topTutoriels.map((tutoriel, index) => (
                    <div key={tutoriel.id} className="tutorial-item">
                      <div className="tutorial-rank">{index + 1}</div>
                      <div className="tutorial-info">
                        <div className="tutorial-title">{tutoriel.titre}</div>
                        <div className="tutorial-details">
                          <span className="tutorial-subject">{tutoriel.matiere}</span>
                          <span className="tutorial-level">{tutoriel.niveau}</span>
                        </div>
                      </div>
                      <div className="tutorial-views">
                        <i className="fa-solid fa-eye"></i> {tutoriel.vues || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">Aucun tutoriel disponible</div>
              )}
            </div>
            
            {/* Tutoriels récents */}
            <div className="recent-tutorials">
              <h3>Tutoriels récents</h3>
              {recentTutoriels.length > 0 ? (
                <div className="tutorials-list">
                  {recentTutoriels.map((tutoriel) => (
                    <div key={tutoriel.id} className="tutorial-item">
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
                        <div className="tutorial-title">{tutoriel.titre}</div>
                        <div className="tutorial-details">
                          <span className="tutorial-date">{formatDate(tutoriel.dateCreation)}</span>
                        </div>
                      </div>
                      <div className="tutorial-actions">
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(tutoriel)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">Aucun tutoriel récent</div>
              )}
            </div>
          </div>
        );
      
      case 'tutorials':
        return (
          <div className="tutorials">
            <div className="tutorials-header">
              <h2>Mes Tutoriels</h2>
              <button 
                className="add-button"
                onClick={() => {
                  resetForm();
                  setShowTutorialForm(!showTutorialForm);
                }}
              >
                {showTutorialForm ? (
                  <>
                    <i className="fa-solid fa-times"></i> Annuler
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus"></i> Ajouter un tutoriel
                  </>
                )}
              </button>
            </div>
            
            {/* Formulaire d'ajout/édition de tutoriel */}
            {showTutorialForm && (
              <div className="tutorial-form-container">
                <h3>{editMode ? 'Modifier le tutoriel' : 'Ajouter un nouveau tutoriel'}</h3>
                <form onSubmit={handleSubmit} className="tutorial-form">
                  <div className="form-group">
                    <label htmlFor="titre">Titre*</label>
                    <input
                      type="text"
                      id="titre"
                      name="titre"
                      value={tutorialData.titre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={tutorialData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="matiere">Matière*</label>
                      <input
                        type="text"
                        id="matiere"
                        name="matiere"
                        value={tutorialData.matiere}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="duree">Durée</label>
                      <input
                        type="text"
                        id="duree"
                        name="duree"
                        value={tutorialData.duree}
                        onChange={handleInputChange}
                        placeholder="Ex: 10:30"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="niveau">Niveau*</label>
                    <select
                      id="niveau"
                      name="niveau"
                      value={tutorialData.niveau}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="fichier">Fichier vidéo{!editMode && '*'}</label>
                    <input
                      type="file"
                      id="fichier"
                      name="fichier"
                      onChange={handleVideoChange}
                      accept="video/*"
                      ref={videoInputRef}
                      required={!editMode}
                    />
                    {videoPreview && (
                      <div className="preview">
                        <video controls width="100%" src={videoPreview} />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="thumbnail">Miniature</label>
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      onChange={handleThumbnailChange}
                      accept="image/*"
                      ref={thumbnailInputRef}
                    />
                    {thumbnailPreview && (
                      <div className="preview">
                        <img src={thumbnailPreview} alt="Aperçu de la miniature" />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-button">
                      {editMode ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        resetForm();
                        setShowTutorialForm(false);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Liste des tutoriels */}
            <div className="tutorials-list-container">
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
                        <div className="tutorial-stats">
                          <span className="tutorial-views">
                            <i className="fa-solid fa-eye"></i> {tutoriel.vues || 0} vues
                          </span>
                          <span className="tutorial-date">
                            <i className="fa-solid fa-calendar"></i> {formatDate(tutoriel.dateCreation)}
                          </span>
                        </div>
                      </div>
                      <div className="tutorial-actions">
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(tutoriel)}
                          title="Modifier"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDelete(tutoriel.id)}
                          title="Supprimer"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button 
                          className="view-button"
                          onClick={() => navigate(`/videos/${tutoriel.id}`)}
                          title="Voir"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  Vous n'avez pas encore créé de tutoriel. Cliquez sur "Ajouter un tutoriel" pour commencer.
                </div>
              )}
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="profile">
            <h2>Mon Profil</h2>
            
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <i className="fa-solid fa-chalkboard-teacher"></i>
                </div>
                <div className="profile-info">
                  <h3>{currentUser?.prenom} {currentUser?.nom}</h3>
                  <p className="profile-email">{currentUser?.email}</p>
                  <p className="profile-role">Instructeur</p>
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
                    <span className="field-label">Tutoriels publiés:</span>
                    <span className="field-value">{tutorielsCount}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Vues totales:</span>
                    <span className="field-value">{totalViews}</span>
                  </div>
                  <div className="profile-field">
                    <span className="field-label">Vues moyennes:</span>
                    <span className="field-value">{averageViews}</span>
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
    <div className="instructeur-panel">
      {/* Barre latérale */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Espace Instructeur</h1>
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
            <span>Mes tutoriels</span>
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
            {activeTab === 'tutorials' && 'Mes tutoriels'}
            {activeTab === 'profile' && 'Mon profil'}
          </div>
          
          <div className="user-info">
            {currentUser && (
              <>
                <div className="user-name">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="user-role">Instructeur</div>
                <div className="user-avatar">
                  <i className="fa-solid fa-chalkboard-teacher"></i>
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

export default InstructeurPanel;
