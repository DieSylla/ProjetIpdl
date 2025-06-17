import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import SubjectManagement from './SubjectManagement';
import '../../style/admin/adminPanel.css';
import '../../style/admin/adminProfile.css';

/**
 * Composant principal de l'interface administrateur
 * Intègre les différents modules de gestion (tableau de bord, utilisateurs, matières)
 */
const AdminPanel = () => {
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  
  // États pour la gestion du profil
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'administrateur'
  });
  
  // Hook de navigation
  const navigate = useNavigate();
  
  // Vérifier que l'utilisateur est bien un administrateur
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user || user.role !== 'administrateur') {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas administrateur
      navigate('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Initialiser les données du profil
    setProfileData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: user.role || 'administrateur'
    });
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
  

  
  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    const firstInitial = profileData.prenom ? profileData.prenom.charAt(0).toUpperCase() : '';
    const lastInitial = profileData.nom ? profileData.nom.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
  // Générer une couleur basée sur l'email
  const getAvatarColor = () => {
    if (!profileData.email) return '#4869ee';
    
    let hash = 0;
    for (let i = 0; i < profileData.email.length; i++) {
      hash = profileData.email.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
  };
  
  // Afficher le contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'subjects':
        return <SubjectManagement />;
      case 'profile':
        return (
          <div className="admin-profile">
            <div className="profile-header">
              <h2>Profil Administrateur</h2>
              <p>Gérez vos informations personnelles</p>
            </div>
            

            
            <div className="profile-content">
              <div className="profile-avatar" style={{ backgroundColor: getAvatarColor() }}>
                {getInitials()}
              </div>
              
              <div className="profile-form">
                <div className="form-group">
                  <label>Prénom</label>
                  <div className="profile-info">{profileData.prenom}</div>
                </div>
                
                <div className="form-group">
                  <label>Nom</label>
                  <div className="profile-info">{profileData.nom}</div>
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <div className="profile-info">{profileData.email}</div>
                </div>
                
                <div className="form-group">
                  <label>Rôle</label>
                  <div className="profile-info profile-role">
                    <i className="fa-solid fa-user-shield"></i>
                    Administrateur
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-security">
              <h3>Sécurité du compte</h3>
              <p>Dernière connexion: {new Date().toLocaleString('fr-FR')}</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="admin-panel">
      {/* Barre latérale */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
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
            className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fa-solid fa-users"></i>
            <span>Utilisateurs</span>
          </button>
          
          <button 
            className={`sidebar-item ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            <i className="fa-solid fa-book"></i>
            <span>Matières</span>
          </button>
          
          <button 
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-user-shield"></i>
            <span>Mon Profil</span>
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
            {activeTab === 'users' && 'Gestion des utilisateurs'}
            {activeTab === 'subjects' && 'Gestion des matières'}
          </div>
          
          <div className="user-info">
            {currentUser && (
              <>
                <div className="user-name">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="user-role">Administrateur</div>
                <div className="user-avatar">
                  <i className="fa-solid fa-user-shield"></i>
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

export default AdminPanel;
