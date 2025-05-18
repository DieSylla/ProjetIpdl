import React, { useState } from 'react';
import './home.css';

const Etudiant = () => {
  const etudiant = { nom: 'Oumar', prenom: 'Diouf' };
  const videos = [
    {
      id_tuto: 1,
      titre: 'Introduction à Java',
      description: 'Apprenez les bases de Java.',
      instructeur: 'Dupont',
      matiere: 'Programmation',
      duree: '45min',
      niveau: 'Débutant',
    },
    {
      id_tuto: 2,
      titre: 'Les bases de SQL',
      description: 'Découvrez SQL pour gérer les bases de données.',
      instructeur: 'Martin',
      matiere: 'Base de données',
      duree: '30min',
      niveau: 'Intermédiaire',
    },
  ];

  const [theme, setTheme] = useState('theme-light');

  const toggleTheme = () => {
    setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light');
  };

  return (
    <div className={`home-page ${theme}`}>
      <header className="header-user">
        <span className="user">Étudiant</span>
        <div className="englobe">
          <span id="user-name">
            <span>{etudiant.nom} {etudiant.prenom}</span>
          </span>
          <ul className="fonctionnalite">
            <li>
              <a href="/updateUser">
                <i className="fa-solid fa-plus"></i> Modifier Profil
              </a>
            </li>
            <li>
              <a href="/deconnexion">
                <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
              </a>
            </li>
          </ul>
        </div>
      </header>
      <main className="container">
        <div className="citation">
          <h1>
            Ce <span>Système de recommandation</span>
          </h1>
          <p style={{ textAlign: 'justify' }}>
            offre des contenus qui vous correspondent parfaitement. Profitez d'une expérience unique et enrichissante !
          </p>
        </div>
        {videos.map((video) => (
          <section className="tutoriel" key={video.id_tuto}>
            <a href={`/tutoriel/${video.id_tuto}`}>
              <div className="cadre">
                <span className="professeur">Mr {video.instructeur}</span>
                <span className={`niveau ${video.niveau.toLowerCase()}`}>
                  {video.niveau}
                </span>
                <header className="header-tutoriel">{video.titre}</header>
                <p>{video.description}</p>
              </div>
              <footer className="footer-tutoriel">
                <span className="matiere">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className="logo-Matiere"
                  >
                    <g>
                      <path
                        d="M91.89 238.457c-29.899 0-54.133 24.239-54.133 54.134 0 29.899 24.234 54.137 54.133 54.137s54.138-24.238 54.138-54.137c0-29.896-24.239-54.134-54.138-54.134z"
                      />
                      <path
                        d="M91.89 462.463c-29.899 0-54.133 24.239-54.133 54.139 0 29.895 24.234 54.133 54.133 54.133s54.138-24.238 54.138-54.133c0-29.9-24.239-54.139-54.138-54.139z"
                      />
                      <path
                        d="M91.89 686.475c-29.899 0-54.133 24.237-54.133 54.133 0 29.899 24.234 54.138 54.133 54.138s54.138-24.238 54.138-54.138c0-29.896-24.239-54.133-54.138-54.133z"
                      />
                      <path
                        d="M941.26 234.723H328.964c-28.867 0-52.263 23.4-52.263 52.268v3.734c0 28.868 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.401 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
                      />
                      <path
                        d="M941.26 682.74H328.964c-28.867 0-52.263 23.399-52.263 52.268v3.734c0 28.863 23.396 52.269 52.263 52.269H941.26c28.869 0 52.269-23.405 52.269-52.269v-3.734c-0.001-28.868-23.4-52.268-52.269-52.268z"
                      />
                      <path
                        d="M709.781 458.729H328.964c-28.867 0-52.263 23.4-52.263 52.269v3.734c0 28.873 23.396 52.269 52.263 52.269h380.817c28.866 0 52.271-23.396 52.271-52.269v-3.734c0.001-28.869-23.405-52.269-52.271-52.269z"
                      />
                    </g>
                  </svg>
                  {video.matiere}
                </span>
                <span className="heure">
                  <svg
                    viewBox="0 0 32 32"
                    style={{
                      fillRule: 'evenodd',
                      clipRule: 'evenodd',
                      strokeLinejoin: 'round',
                      strokeMiterlimit: 2,
                    }}
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className="logo-Heure"
                  >
                    <path
                      d="M16,6c-5.519,0 -10,4.481 -10,10c0,5.519 4.481,10 10,10c5.519,0 10,-4.481 10,-10c0,-5.519 -4.481,-10 -10,-10Zm0,2c4.415,0 8,3.585 8,8c0,4.415 -3.585,8 -8,8c-4.415,0 -8,-3.585 -8,-8c0,-4.415 3.585,-8 8,-8Z"
                    />
                    <path
                      d="M15.5,13l0,3c0,0.099 0.029,0.195 0.084,0.277l2,3c0.153,0.23 0.464,0.292 0.693,0.139c0.23,-0.153 0.292,-0.464 0.139,-0.693l-1.916,-2.874c0,-0 0,-2.849 0,-2.849c0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,-0 -0.5,0.224 -0.5,0.5Z"
                    />
                    <path
                      d="M7,16.5l4,-0c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5l-4,0c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5Z"
                    />
                    <path
                      d="M15.5,7l0,4c0,0.276 0.224,0.5 0.5,0.5c0.276,-0 0.5,-0.224 0.5,-0.5l0,-4c0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,-0 -0.5,0.224 -0.5,0.5Z"
                    />
                    <path
                      d="M25,15.5l-4,0c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5l4,-0c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5Z"
                    />
                    <path
                      d="M16.5,25l0,-4c0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,-0 -0.5,0.224 -0.5,0.5l0,4c0,0.276 0.224,0.5 0.5,0.5c0.276,-0 0.5,-0.224 0.5,-0.5Z"
                    />
                  </svg>
                  {video.duree}
                </span>
              </footer>
            </a>
          </section>
        ))}
      </main>
      <footer className="footer-student">
        <div className="motivation">
          <div className="entete">Objectif du système</div>
          <p>
            Découvrez une nouvelle façon d'apprendre avec notre système de recommandation de pointe, spécialement conçu pour les étudiants avides de nouvelles perspectives. Que vous soyez fasciné par l'histoire ancienne, les sciences modernes, l'art contemporain ou la technologie de demain, notre plateforme vous guide vers les contenus qui stimuleront votre curiosité et enrichiront vos connaissances.
          </p>
        </div>
        <div className="contact">
          <div className="entete">Me contacter</div>
          <p>
            <i className="fa-solid fa-envelope"></i> Par email
          </p>
          <div className="entete">Thème</div>
          <span className="champ" tabIndex="0" onClick={toggleTheme}>
            <span className={`bouttonRond ${theme === 'theme-dark' ? 'position' : ''}`}>
              {theme === 'theme-light' ? (
                <i className="fa-regular fa-sun"></i>
              ) : (
                <i className="fa-regular fa-moon"></i>
              )}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Etudiant;