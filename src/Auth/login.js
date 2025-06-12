import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/styles.css';
import '../style/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(() => {
    // Récupérer le dernier rôle utilisé depuis le localStorage
    return localStorage.getItem('lastRole') || 'etudiant';
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberRole, setRememberRole] = useState(() => {
    // Vérifier si l'option de se souvenir du rôle est activée
    return localStorage.getItem('rememberRole') === 'true';
  });

  useEffect(() => {
    // Simule un message de succès ou erreur depuis l'URL (comme ?created ou ?error)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('created')) setSuccess('Compte créé avec succès');
    if (urlParams.get('error')) setError('Erreur email ou mot de passe');
  }, []);

  // Mettre à jour le rôle dans le localStorage lorsqu'il change
  useEffect(() => {
    if (rememberRole) {
      localStorage.setItem('lastRole', role);
    }
  }, [role, rememberRole]);

  // Gérer le changement de l'option se souvenir du rôle
  const handleRememberRoleChange = (e) => {
    const checked = e.target.checked;
    setRememberRole(checked);
    localStorage.setItem('rememberRole', checked.toString());
    
    if (!checked) {
      // Si l'option est désactivée, supprimer le rôle enregistré
      localStorage.removeItem('lastRole');
    } else {
      // Si l'option est activée, enregistrer le rôle actuel
      localStorage.setItem('lastRole', role);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Vérification des champs
      if (!email || !password || !role) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      // Récupération des utilisateurs enregistrés
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Recherche de l'utilisateur
      const user = registeredUsers.find(
        (user) => user.email === email && user.password === password && user.role === role
      );

      if (!user) {
        setError('Email, mot de passe ou profil incorrect');
        return;
      }

      // Connexion réussie
      setSuccess('Connexion réussie ! Redirection...');
      
      // Enregistrement de l'utilisateur connecté
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Si l'option est activée, enregistrer le rôle
      if (rememberRole) {
        localStorage.setItem('lastRole', role);
      }
      
      // Redirection en fonction du rôle
      setTimeout(() => {
        if (role === 'etudiant') {
          navigate('/etudiant');
        } else if (role === 'instructeur') {
          navigate('/instructeur');
        } else if (role === 'administrateur') {
          navigate('/admin');
        }
      }, 1500);
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error(error);
    }  
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenue</h1>
          <p>Connectez-vous pour accéder à la plateforme</p>
        </div>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                id="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                id="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="role-label">Sélectionnez votre profil</label>
            <div className="role-selector">
              <div className={`role-option ${role === 'etudiant' ? 'active' : ''}`} onClick={() => setRole('etudiant')}>
                <i className="fa-solid fa-user-graduate"></i>
                <span>Étudiant</span>
              </div>
              
              <div className={`role-option ${role === 'instructeur' ? 'active' : ''}`} onClick={() => setRole('instructeur')}>
                <i className="fa-solid fa-chalkboard-teacher"></i>
                <span>Instructeur</span>
              </div>
              
              <div className={`role-option ${role === 'administrateur' ? 'active' : ''}`} onClick={() => setRole('administrateur')}>
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin</span>
              </div>
            </div>
            
            <div className="remember-role">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberRole} 
                  onChange={handleRememberRoleChange} 
                />
                <span className="checkmark"></span>
                Se souvenir de mon profil
              </label>
            </div>
          </div>
          
          <button type="submit" className="login-button">
            <i className="fa-solid fa-right-to-bracket"></i> Se connecter
          </button>
          
          <div className="login-footer">
            <p>Vous êtes nouveau ? <Link to="/register" className="register-link">Créer un compte</Link></p>
            <p><Link to="/forgot-password" className="forgot-password-link">Mot de passe oublié ?</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;