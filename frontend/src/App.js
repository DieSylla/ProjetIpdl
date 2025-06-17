import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Auth/login';
import Register from './register';
import ForgotPassword from './Auth/ForgotPassword';
import AdminPanel from './components/admin/AdminPanel';
import EtudiantPanel from './components/etudiant/EtudiantPanel';
import InstructeurPanel from './components/instructeur/InstructeurPanel';
import Profil from './profil';
import VideoBrowser from './pages/VideoBrowser';
import VideoPlayer from './pages/VideoPlayer';
import { initializeAdminAccount } from './utils/adminInitializer';
import './style/App.css';

function App() {
  // Initialiser le compte administrateur au démarrage de l'application
  useEffect(() => {
    initializeAdminAccount();
  }, []);

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/etudiant" element={<EtudiantPanel />} />
          <Route path="/instructeur" element={<InstructeurPanel />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/videos" element={<VideoBrowser />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
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