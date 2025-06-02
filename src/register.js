import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/styles.css';

const Register = () => {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('etudiant');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Simuler l'enregistrement d'un utilisateur
    const user = {
      nom,
      prenom,
      email,
      password, // Note: Dans une application réelle, ne jamais stocker les mots de passe en clair
      role
    };
    
    // Stocker l'utilisateur dans localStorage (pour simulation uniquement)
    localStorage.setItem('registeredUsers', JSON.stringify([
      ...JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
      user
    ]));
    
    // Rediriger vers la page de connexion avec un paramètre de succès
    navigate('/login?created=true');
  };

  return (
    <div className="containerFormulaire">
      {error && <div className="erreur">{error}</div>}
      <h2>Inscription</h2>
      <form className="formInscription" onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <label htmlFor="prenom">Prénom</label>
        <input
          type="text"
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Mot de passe</label>
        <div className="password-container">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <div className="password-container">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <label htmlFor="role">Profil</label>
        <div className="profil">
          <label>
            <input
              type="radio"
              name="role"
              value="etudiant"
              checked={role === 'etudiant'}
              onChange={(e) => setRole(e.target.value)}
            />
            Étudiant
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="instructeur"
              checked={role === 'instructeur'}
              onChange={(e) => setRole(e.target.value)}
            />
            Instructeur
          </label>
        </div>
        <button type="submit">S'inscrire</button>
        <p>Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
      </form>
    </div>
  );
};

export default Register;