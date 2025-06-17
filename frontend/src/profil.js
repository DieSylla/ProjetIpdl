import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/profil.css';

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nom: '', prenom: '', email: '', role: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', email: '' });

  // Charger les données de l'utilisateur
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setFormData({
      nom: currentUser.nom,
      prenom: currentUser.prenom,
      email: currentUser.email
    });
  }, [navigate]);

  const handleSaveChanges = () => {
    // Mettre à jour les informations utilisateur
    const updatedUser = {
      ...user,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email
    };

    setUser(updatedUser);
    setIsEditing(false);

    // Mettre à jour l'utilisateur dans localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.nom = formData.nom;
      currentUser.prenom = formData.prenom;
      currentUser.email = formData.email;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Mettre également à jour dans la liste des utilisateurs enregistrés
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mettre à jour les informations de l'utilisateur
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    
    // Mettre à jour dans localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Mettre à jour dans la liste des utilisateurs enregistrés
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map(u => 
      u.email === user.email ? { ...u, nom: formData.nom, prenom: formData.prenom } : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
  };

  const handleBack = () => {
    // Rediriger vers la page appropriée selon le rôle
    switch (user.role) {
      case 'etudiant':
        navigate('/etudiant');
        break;
      case 'instructeur':
        navigate('/instructeur');
        break;
      case 'administrateur':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="profil-container">
      <div className="profil-header">
        <button className="back-button" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left"></i> Retour
        </button>
        <h1>Mon Profil</h1>
      </div>
      
      <div className="profil-content">
        <div className="profil-left">
          <div className="user-header">
            <div className="user-initials">
              {user.prenom && user.nom ? `${user.prenom[0]}${user.nom[0]}` : '?'}
            </div>
            <h2>{user.prenom} {user.nom}</h2>
            <p className="user-role">{user.role}</p>
          </div>
          
          <div className="user-info">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small>L'email ne peut pas être modifié</small>
                </div>
                <div className="form-group">
                  <label>Rôle</label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    <i className="fa-solid fa-save"></i> Enregistrer
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setFormData({
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email
                      });
                      setIsEditing(false);
                    }}
                  >
                    <i className="fa-solid fa-times"></i> Annuler
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="info-group">
                  <span className="info-label">Nom</span>
                  <span className="info-value">{user.nom}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Prénom</span>
                  <span className="info-value">{user.prenom}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Rôle</span>
                  <span className="info-value">{user.role}</span>
                </div>
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fa-solid fa-edit"></i> Modifier mes informations
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="profil-right">
          <div className="info-container">
            <h2>Informations complémentaires</h2>
            <div className="info-text">
              <p>Vous pouvez modifier vos informations personnelles et votre photo de profil à tout moment.</p>
              <p>Ces informations seront visibles par les autres utilisateurs de la plateforme.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
