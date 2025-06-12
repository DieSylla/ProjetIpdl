import React, { useState, useEffect } from 'react';
import { getOrGenerateStatistics } from '../../utils/statisticsGenerator';
import { getTutorialStatsByInstructor } from '../../utils/adminUtils';
import '../../style/admin/dashboard.css';

/**
 * Composant de tableau de bord pour l'administrateur
 * Affiche les statistiques importantes de l'application
 */
const Dashboard = () => {
  // État pour les statistiques
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instructorStats, setInstructorStats] = useState([]);
  
  // Charger les statistiques au chargement du composant
  useEffect(() => {
    loadStatistics();
  }, []);
  
  // Charger les statistiques
  const loadStatistics = () => {
    setLoading(true);
    
    // Récupérer ou générer les statistiques
    const stats = getOrGenerateStatistics();
    setStatistics(stats);
    
    // Récupérer les statistiques par instructeur
    const instructorData = getTutorialStatsByInstructor();
    setInstructorStats(instructorData);
    
    setLoading(false);
  };
  
  // Rafraîchir les statistiques
  const refreshStatistics = () => {
    setLoading(true);
    
    // Forcer la régénération des statistiques
    const stats = getOrGenerateStatistics(true);
    setStatistics(stats);
    
    // Récupérer les statistiques par instructeur
    const instructorData = getTutorialStatsByInstructor();
    setInstructorStats(instructorData);
    
    setLoading(false);
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtenir les données pour le graphique des utilisateurs par rôle
  const getUserRoleData = () => {
    if (!statistics || !statistics.users || !statistics.users.byRole) {
      return [];
    }
    
    const roles = statistics.users.byRole;
    return [
      { label: 'Étudiants', value: roles.etudiant || 0, color: '#4e73df' },
      { label: 'Instructeurs', value: roles.instructeur || 0, color: '#1cc88a' },
      { label: 'Administrateurs', value: roles.administrateur || 0, color: '#36b9cc' }
    ];
  };
  
  // Obtenir les données pour le graphique des tutoriels par niveau
  const getTutorialLevelData = () => {
    if (!statistics || !statistics.tutorials || !statistics.tutorials.byLevel) {
      return [];
    }
    
    const levels = statistics.tutorials.byLevel;
    return [
      { label: 'Débutant', value: levels['Débutant'] || 0, color: '#4e73df' },
      { label: 'Intermédiaire', value: levels['Intermédiaire'] || 0, color: '#1cc88a' },
      { label: 'Avancé', value: levels['Avancé'] || 0, color: '#f6c23e' },
      { label: 'Autre', value: levels['Autre'] || 0, color: '#e74a3b' }
    ];
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de Bord</h2>
        <button className="refresh-button" onClick={refreshStatistics} disabled={loading}>
          <i className="fa-solid fa-sync"></i> Rafraîchir
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Chargement des statistiques...</div>
      ) : !statistics ? (
        <div className="no-data">Aucune statistique disponible</div>
      ) : (
        <div className="dashboard-content">
          {/* Dernière mise à jour */}
          <div className="last-updated">
            Dernière mise à jour: {formatDate(statistics.lastUpdated)}
          </div>
          
          {/* Cartes de statistiques */}
          <div className="stat-cards">
            <div className="stat-card users">
              <div className="stat-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>Utilisateurs</h3>
                <div className="stat-value">{statistics.users.total}</div>
                <div className="stat-details">
                  {statistics.users.byRole.etudiant || 0} étudiants, {statistics.users.byRole.instructeur || 0} instructeurs
                </div>
              </div>
            </div>
            
            <div className="stat-card tutorials">
              <div className="stat-icon">
                <i className="fa-solid fa-video"></i>
              </div>
              <div className="stat-info">
                <h3>Tutoriels</h3>
                <div className="stat-value">{statistics.tutorials.total}</div>
                <div className="stat-details">
                  {Object.keys(statistics.tutorials.bySubject).length} matières différentes
                </div>
              </div>
            </div>
            
            <div className="stat-card activities">
              <div className="stat-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>Activités</h3>
                <div className="stat-value">{statistics.activity.total}</div>
                <div className="stat-details">
                  {statistics.activity.recentActivity.length} activités récentes
                </div>
              </div>
            </div>
          </div>
          
          {/* Graphiques */}
          <div className="charts-container">
            {/* Utilisateurs par rôle */}
            <div className="chart-card">
              <h3>Utilisateurs par rôle</h3>
              <div className="chart-content">
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100">
                    {getUserRoleData().map((item, index) => {
                      // Calculer les angles pour le graphique en camembert
                      const total = getUserRoleData().reduce((sum, d) => sum + d.value, 0);
                      const startAngle = getUserRoleData()
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.value / total) * 360, 0);
                      const endAngle = startAngle + (item.value / total) * 360;
                      
                      // Convertir les angles en coordonnées
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      // Déterminer si l'arc est grand ou petit
                      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                      
                      // Créer le chemin SVG
                      const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      
                      return (
                        <path
                          key={index}
                          d={path}
                          fill={item.color}
                        />
                      );
                    })}
                  </svg>
                </div>
                
                <div className="chart-legend">
                  {getUserRoleData().map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                      <div className="legend-label">{item.label}</div>
                      <div className="legend-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tutoriels par niveau */}
            <div className="chart-card">
              <h3>Tutoriels par niveau</h3>
              <div className="chart-content">
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100">
                    {getTutorialLevelData().map((item, index) => {
                      // Calculer les angles pour le graphique en camembert
                      const total = getTutorialLevelData().reduce((sum, d) => sum + d.value, 0);
                      
                      // Si le total est 0, ne pas afficher de graphique
                      if (total === 0) return null;
                      
                      const startAngle = getTutorialLevelData()
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.value / total) * 360, 0);
                      const endAngle = startAngle + (item.value / total) * 360;
                      
                      // Convertir les angles en coordonnées
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      // Déterminer si l'arc est grand ou petit
                      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                      
                      // Créer le chemin SVG
                      const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                      
                      return (
                        <path
                          key={index}
                          d={path}
                          fill={item.color}
                        />
                      );
                    })}
                  </svg>
                </div>
                
                <div className="chart-legend">
                  {getTutorialLevelData().map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                      <div className="legend-label">{item.label}</div>
                      <div className="legend-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tutoriels les plus vus */}
          <div className="popular-tutorials">
            <h3>Tutoriels les plus populaires</h3>
            {statistics.tutorials.mostViewed && statistics.tutorials.mostViewed.length > 0 ? (
              <div className="tutorials-list">
                {statistics.tutorials.mostViewed.map((tutorial, index) => (
                  <div key={index} className="tutorial-item">
                    <div className="tutorial-rank">{index + 1}</div>
                    <div className="tutorial-info">
                      <div className="tutorial-title">{tutorial.titre}</div>
                      <div className="tutorial-details">
                        <span className="tutorial-subject">{tutorial.matiere}</span>
                        <span className="tutorial-level">{tutorial.niveau}</span>
                      </div>
                    </div>
                    <div className="tutorial-views">
                      <i className="fa-solid fa-eye"></i> {tutorial.vues || 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Aucun tutoriel disponible</div>
            )}
          </div>
          
          {/* Top instructeurs */}
          <div className="top-instructors">
            <h3>Top Instructeurs</h3>
            {instructorStats && instructorStats.length > 0 ? (
              <div className="instructors-list">
                {instructorStats.slice(0, 5).map((instructor, index) => (
                  <div key={index} className="instructor-item">
                    <div className="instructor-rank">{index + 1}</div>
                    <div className="instructor-info">
                      <div className="instructor-name">
                        {instructor.prenom} {instructor.nom}
                      </div>
                      <div className="instructor-email">{instructor.email}</div>
                    </div>
                    <div className="instructor-tutorials">
                      <i className="fa-solid fa-video"></i> {instructor.tutorialCount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Aucun instructeur disponible</div>
            )}
          </div>
          
          {/* Activités récentes */}
          <div className="recent-activities">
            <h3>Activités récentes</h3>
            {statistics.activity.recentActivity && statistics.activity.recentActivity.length > 0 ? (
              <div className="activities-list">
                {statistics.activity.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fa-solid ${
                        activity.action.includes('user') ? 'fa-user' :
                        activity.action.includes('subject') ? 'fa-book' :
                        activity.action.includes('tutorial') ? 'fa-video' :
                        'fa-circle-info'
                      }`}></i>
                    </div>
                    <div className="activity-info">
                      <div className="activity-action">
                        {activity.action.replace(/_/g, ' ')}
                      </div>
                      <div className="activity-time">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Aucune activité récente</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
