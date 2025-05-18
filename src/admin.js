import React from 'react';
import './admin.css';

const Admin = () => {
  const stats = {
    tutoriels: 10,
    etudiants: 50,
    instructeurs: 5,
    personnesConnectees: 1,
  };

  const dernieresVideos = [
    { titre: 'Introduction à Java', matiere: 'Programmation', instructeur: 'Mr Diop' },
    { titre: 'Les bases de SQL', matiere: 'Base de données', instructeur: 'Mr Mbackei' },
  ];

  const videosPlusVues = [
    { titre: 'Python pour débutants', matiere: 'Programmation', instructeur: 'Mr Saloum' },
    { titre: 'Algèbre linéaire', matiere: 'Mathématiques', instructeur: 'Mr Sissoko' },
  ];

  return (
    <div className="admin-page">
      <nav className="nav-bar">
        <h1>
          <a href="/admin" className="activiteEnCours">
            Dashboard
          </a>
          <i className="fa-solid fa-bars"></i>
        </h1>
        <ul>
          <li>
            <a href="/gestionEtudiant">
              <svg
                version="1.1"
                className="_x32_"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path
                    className="st0"
                    d="M81.876,169.851v-68.266l67.776,43.851v55.916c0,0,0.351-0.157,0.942-0.416
                    c1.042,29.01,13.236,55.26,32.406,74.413c20.057,20.075,47.858,32.517,78.474,32.508c30.616,0.01,58.427-12.432,78.474-32.508
                    c19.179-19.153,31.373-45.403,32.407-74.413c0.599,0.259,0.95,0.416,0.95,0.416v-55.916l86.412-55.906L261.473,0L63.24,89.531
                    v80.32c-6.277,1.486-10.956,7.089-10.956,13.817v4.07H92.84v-4.07C92.84,176.94,88.151,171.337,81.876,169.851z M170.889,194.385
                    c22.282-5.345,58.454-8.464,90.584,14.02c32.13-22.484,68.312-19.365,90.593-14.02c0.018,0.831,0.055,1.66,0.055,2.491
                    c0,25.07-10.125,47.664-26.546,64.104c-16.438,16.42-39.033,26.546-64.102,26.554c-25.059-0.008-47.655-10.134-64.093-26.554
                    c-16.42-16.439-26.546-39.034-26.555-64.104C170.825,196.045,170.871,195.216,170.889,194.385z"
                  />
                  <path
                    className="st0"
                    d="M52.284,219.592c0,7.864,6.368,14.232,14.233,14.232h12.091c7.854,0,14.232-6.369,14.232-14.232v-23.38H52.284V219.592z"
                  />
                  <path
                    className="st0"
                    d="M326.989,314.024c0,0-3.185,2.547-8.926,5.861l-56.589,95.761l-56.589-95.761c-5.741-3.314-8.925-5.861-8.925-5.861c-51.209,22.586-72.29,76.812-72.29,119.732c0,42.929,0,78.244,0,78.244h275.619c0,0,0-35.315,0-78.244C399.288,390.836,378.197,336.61,326.989,314.024z"
                  />
                </g>
              </svg>
              Étudiant
            </a>
          </li>
          <li>
            <a href="/gestionInstructeur">
              <svg
                version="1.1"
                className="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 31.178 31.178"
              >
                <g>
                  <circle cx="5.042" cy="5.721" r="3.866" />
                  <path
                    d="M30.779,6.78h-9.346V5.722h-2.479V6.78h-8.877H9.446v1.275h0.631v2.806l-1.452-0.692H6.449l-1.474,1.709l-1.426-1.709
                    l-3.133,0.582l-0.2,6.949h1.328l0.072,1.443h0.202v0.879v0.649v6.884H1.551L0,27.893v1.43h1.321l1.542-0.251l0.014,0.251h1.708
                    v-1.593v-0.173v-6.883h0.973v6.883v0.173v1.593h1.708l0.014-0.251l1.542,0.251h1.321v-1.43L8.59,27.557H8.325v-6.883v-0.649v-0.879
                    H8.57l0.316-6.4l1.191,0.539v7.355h9.136v2.343l-5.042,5.688h1.812l3.404-3.844v3.844h1.041v-3.84l3.399,3.84h1.841l-5.07-5.688
                    v-2.343h10.182V8.056h0.398V6.78H30.779z M29.887,19.7h-9.291h-1.383H10.97v-6.013l3.717,1.682l-0.014-2.317l-3.703-1.765V8.056
                    h18.917V19.7z"
                  />
                  <path
                    d="M18.396,13.728v2.915c0,0,1.058-0.367,2.09-0.012c1.031,0.356,2.777,1.406,2.777,1.406s0.532-0.867,1.156-1.269
                    c0.623-0.401,1.104-0.709,1.104-0.709v-2.254l-1.922,1.698L18.396,13.728z"
                  />
                  <polygon
                    points="16.404,15.174 16.027,15.174 16.027,16.77 17.348,16.77 17.348,15.174 16.95,15.174 16.95,12.959 23.535,15.069 
                    27.727,11.33 20.912,9.366 15.555,12.512 16.404,12.785"
                  />
                </g>
              </svg>
              Instructeur
            </a>
          </li>
          <li>
            <a href="/adminGestionTuto">
              <svg
                className="logo-video"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.50989 2.00001H15.49C15.7225 1.99995 15.9007 1.99991 16.0565 2.01515C17.1643 2.12352 18.0711 2.78958 18.4556 3.68678H5.54428C5.92879 2.78958 6.83555 2.12352 7.94337 2.01515C8.09917 1.99991 8.27741 1.99995 8.50989 2.00001Z"
                />
                <path
                  d="M6.31052 4.72312C4.91989 4.72312 3.77963 5.56287 3.3991 6.67691C3.39117 6.70013 3.38356 6.72348 3.37629 6.74693C3.77444 6.62636 4.18881 6.54759 4.60827 6.49382C5.68865 6.35531 7.05399 6.35538 8.64002 6.35547H15.5321C17.1181 6.35538 18.4835 6.35531 19.5639 6.49382C19.9833 6.54759 20.3977 6.62636 20.7958 6.74693C20.7886 6.72348 20.781 6.70013 20.773 6.67691C20.3925 5.56287 19.2522 4.72312 17.8616 4.72312H6.31052Z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.3276 7.54204H8.67239C5.29758 7.54204 3.61017 7.54204 2.66232 8.52887C1.71447 9.5157 1.93748 11.0403 2.38351 14.0896L2.80648 16.9811C3.15626 19.3724 3.33115 20.568 4.22834 21.284C5.12553 22 6.4488 22 9.09534 22H14.9046C17.5512 22 18.8745 22 19.7717 21.284C20.6689 20.568 20.8437 19.3724 21.1935 16.9811L21.6165 14.0896C22.0625 11.0404 22.2855 9.51569 21.3377 8.52887C20.3898 7.54204 18.7024 7.54204 15.3276 7.54204ZM14.5812 15.7942C15.1396 15.4481 15.1396 14.5519 14.5812 14.2058L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9099V17.0901C10 17.7829 10.6669 18.2208 11.2096 17.8844L14.5812 15.7942Z"
                />
              </svg>
              Tutoriel
            </a>
          </li>
          <li>
            <a href="/gestionMatiere">
              <svg
                className="logo-matiere"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  d="M0 448c0 35.3 28.7 64 64 64H224V384c0-17.7 14.3-32 32-32H384V64c0-35.3-28.7-64-64-64H64C28.7 0 0 28.7 0 64V448zM171.3 75.3l-96 96c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l96-96c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6zm96 32l-160 160c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l160-160c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6zM384 384H256V512L384 384z"
                />
              </svg>
              Matière
            </a>
          </li>
          <li>
            <a href="/deconnexion">
              <svg
                className="logout"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z"
                />
                <path
                  d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z"
                />
              </svg>
              Déconnexion
            </a>
          </li>
        </ul>
      </nav>
      <main className="content">
        <header className="header-user">
          <span className="user" style={{ color: '#6c757d' }}>
            Administrateur
          </span>
        </header>
        <div className="infos">
          <section className="infoSection">
            <div className="nombre">Nombre de tutoriels</div>
            <div className="representation">
              <i className="logo-video-section fa-brands fa-youtube"></i>
              {stats.tutoriels}
            </div>
            <a href="/adminGestionTuto">
              <div className="infoSectionFooter">Voir plus...</div>
            </a>
          </section>
          <section className="infoSection">
            <div className="nombre">Nombre d'étudiants</div>
            <div className="representation">
              <i className="logo-etudiant-section fa-solid fa-graduation-cap"></i>
              {stats.etudiants}
            </div>
            <a href="/gestionEtudiant">
              <div className="infoSectionFooter">Voir plus...</div>
            </a>
          </section>
          <section className="infoSection">
            <div className="nombre">Nombre d'instructeurs</div>
            <div className="representation">
              <i className="logo-instructeur-section fa-solid fa-person-chalkboard"></i>
              {stats.instructeurs}
            </div>
            <a href="/gestionInstructeur">
              <div className="infoSectionFooter">Voir plus...</div>
            </a>
          </section>
          <section className="infoSection">
            <div className="nombre">Personnes connectées</div>
            <div className="representation">
              <i className="logo-personne-section fa-solid fa-users"></i>
              {stats.personnesConnectees}
            </div>
            <a href="#">
              <div className="infoSectionFooter">Voir plus...</div>
            </a>
          </section>
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'start' }}>
          <div className="tableau2" style={{ margin: 0, width: '55%', marginLeft: '9.7px' }}>
            <div>
              <i className="fa-brands fa-youtube" aria-hidden="true"></i>
              <span>Dernières vidéos</span>
            </div>
            <div className="tableau2Info">
              <div>Titre</div>
              <div>Matière</div>
              <div>Nom Professeur</div>
            </div>
            {dernieresVideos.map((video, index) => (
              <div className="ligne" key={index}>
                <div>{video.titre}</div>
                <div>{video.matiere}</div>
                <div>{video.instructeur}</div>
              </div>
            ))}
          </div>
          <div className="tableau2" style={{ margin: 0, width: '42%', marginLeft: '9.7px' }}>
            <div>
              <i className="fa-brands fa-youtube" aria-hidden="true"></i>
              <span>Les vidéos les plus vues</span>
            </div>
            <div className="tableau2Info">
              <div>Titre</div>
              <div>Matière</div>
              <div>Nom Professeur</div>
            </div>
            {videosPlusVues.map((video, index) => (
              <div className="ligne" key={index}>
                <div>{video.titre}</div>
                <div>{video.matiere}</div>
                <div>{video.instructeur}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer" style={{ color: '#545454' }}>
          © <span style={{ color: '#1874a6' }}>Système de recommandation</span>, 2023-2024 Tous droits réservés.
        </div>
      </main>
    </div>
  );
};

export default Admin;