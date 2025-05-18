import React, { useState, useEffect } from 'react';
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('etudiant');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Simule un message de succès ou erreur depuis l'URL (comme ?created ou ?error)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('created')) setSuccess('Compte créé avec succès');
    if (urlParams.get('error')) setError('Erreur email ou mot de passe');
  }, []);

  return (
    <div className="containerFormulaire">
      {success && <div className="succes">{success}</div>}
      {error && <div className="messageErreur">{error}</div>}
      <h2>Connexion</h2>
      <form className="formInscription">
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
          <label>
            <input
              type="radio"
              name="role"
              value="administrateur"
              checked={role === 'administrateur'}
              onChange={(e) => setRole(e.target.value)}
            />
            Administrateur
          </label>
        </div>
        <button type="submit">Se connecter</button>
        <p>Vous êtes nouveau ? <a href="/register">Créer un compte</a></p>
      </form>
    </div>
  );
};

export default Login;