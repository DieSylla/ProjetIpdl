import React, { useState } from 'react';
import './styles.css';

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('etudiant');
  const [error, setError] = useState('');

  return (
    <div className="containerFormulaire">
      {error && <div className="erreur">{error}</div>}
      <h2>Inscription</h2>
      <form className="formInscription">
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