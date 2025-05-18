import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Admin from './admin';
import Etudiant from './etudiant';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header-user">
          <span className="user">
            <Link to="/">
              <svg
                className="logo-Youtube"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
              </svg>
              &nbsp;SRV
            </Link>
          </span>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/etudiant" element={<Etudiant />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composant Home temporaire
function Home() {
  return (
    <div className="home">
      <h1>Bienvenue sur le système de recommandation vidéo</h1>
      <Link to="/login">Connexion</Link> | <Link to="/register">Inscription</Link>
    </div>
  );
}

export default App;