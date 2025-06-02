import React, { useState, useEffect } from 'react';
import { 
  searchUsers, 
  changeUserRole, 
  disableUser, 
  enableUser, 
  resetUserPassword 
} from '../../utils/adminUtils';
import '../../style/admin/userManagement.css';

/**
 * Composant de gestion des utilisateurs pour l'administrateur
 */
const UserManagement = () => {
  // État pour les utilisateurs et les filtres
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('dateCreation');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // État pour l'utilisateur sélectionné et le modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  
  // Charger les utilisateurs au chargement du composant
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Filtrer les utilisateurs lorsque les critères changent
  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortDirection]);
  
  // Charger les utilisateurs depuis l'API
  const loadUsers = () => {
    setLoading(true);
    
    // Récupérer tous les utilisateurs
    const allUsers = searchUsers();
    setUsers(allUsers);
    
    setLoading(false);
  };
  
  // Filtrer les utilisateurs selon les critères
  const filterUsers = () => {
    // Construire les critères de recherche
    const criteria = {
      query: searchQuery,
      sortBy,
      sortDirection
    };
    
    // Ajouter le filtre de rôle s'il est défini
    if (roleFilter) {
      criteria.role = roleFilter;
    }
    
    // Ajouter le filtre de statut s'il est défini
    if (statusFilter === 'active') {
      criteria.active = true;
    } else if (statusFilter === 'inactive') {
      criteria.active = false;
    }
    
    // Rechercher les utilisateurs avec ces critères
    const results = searchUsers(criteria);
    setFilteredUsers(results);
  };
  
  // Gérer le changement de rôle d'un utilisateur
  const handleRoleChange = (userId) => {
    // Récupérer l'utilisateur
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Définir l'utilisateur sélectionné et ouvrir le modal
    setSelectedUser(user);
    setNewRole(user.role);
    setModalType('changeRole');
    setShowModal(true);
  };
  
  // Confirmer le changement de rôle
  const confirmRoleChange = () => {
    if (!selectedUser || !newRole) return;
    
    // Récupérer l'administrateur actuel
    const adminId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    if (!adminId) return;
    
    // Changer le rôle de l'utilisateur
    const updatedUser = changeUserRole(selectedUser.id, newRole, adminId);
    
    if (updatedUser) {
      // Mettre à jour la liste des utilisateurs
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      
      setActionMessage({
        text: `Le rôle de ${updatedUser.prenom} ${updatedUser.nom} a été changé en ${newRole}.`,
        type: 'success'
      });
    } else {
      setActionMessage({
        text: 'Erreur lors du changement de rôle.',
        type: 'error'
      });
    }
    
    // Fermer le modal
    setShowModal(false);
    setSelectedUser(null);
    setNewRole('');
    
    // Effacer le message après 3 secondes
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
  };
  
  // Gérer la désactivation/réactivation d'un utilisateur
  const handleToggleStatus = (userId) => {
    // Récupérer l'utilisateur
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Définir l'utilisateur sélectionné et ouvrir le modal
    setSelectedUser(user);
    setModalType(user.active ? 'disable' : 'enable');
    setShowModal(true);
  };
  
  // Confirmer le changement de statut
  const confirmStatusChange = () => {
    if (!selectedUser) return;
    
    // Récupérer l'administrateur actuel
    const adminId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    if (!adminId) return;
    
    // Désactiver ou réactiver l'utilisateur
    const isActive = selectedUser.active;
    const updatedUser = isActive 
      ? disableUser(selectedUser.id, adminId)
      : enableUser(selectedUser.id, adminId);
    
    if (updatedUser) {
      // Mettre à jour la liste des utilisateurs
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      
      setActionMessage({
        text: `Le compte de ${updatedUser.prenom} ${updatedUser.nom} a été ${isActive ? 'désactivé' : 'réactivé'}.`,
        type: 'success'
      });
    } else {
      setActionMessage({
        text: `Erreur lors de la ${isActive ? 'désactivation' : 'réactivation'} du compte.`,
        type: 'error'
      });
    }
    
    // Fermer le modal
    setShowModal(false);
    setSelectedUser(null);
    
    // Effacer le message après 3 secondes
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
  };
  
  // Gérer la réinitialisation du mot de passe
  const handleResetPassword = (userId) => {
    // Récupérer l'utilisateur
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Définir l'utilisateur sélectionné et ouvrir le modal
    setSelectedUser(user);
    setNewPassword('');
    setModalType('resetPassword');
    setShowModal(true);
  };
  
  // Confirmer la réinitialisation du mot de passe
  const confirmPasswordReset = () => {
    if (!selectedUser || !newPassword) return;
    
    // Récupérer l'administrateur actuel
    const adminId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    if (!adminId) return;
    
    // Réinitialiser le mot de passe
    const updatedUser = resetUserPassword(selectedUser.id, newPassword, adminId);
    
    if (updatedUser) {
      setActionMessage({
        text: `Le mot de passe de ${updatedUser.prenom} ${updatedUser.nom} a été réinitialisé.`,
        type: 'success'
      });
    } else {
      setActionMessage({
        text: 'Erreur lors de la réinitialisation du mot de passe.',
        type: 'error'
      });
    }
    
    // Fermer le modal
    setShowModal(false);
    setSelectedUser(null);
    setNewPassword('');
    
    // Effacer le message après 3 secondes
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
  };
  
  // Gérer le tri des utilisateurs
  const handleSort = (field) => {
    if (sortBy === field) {
      // Inverser la direction si on clique sur le même champ
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Définir le nouveau champ de tri et la direction par défaut
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Fermer le modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewPassword('');
    setNewRole('');
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
  
  return (
    <div className="user-management">
      <h2>Gestion des Utilisateurs</h2>
      
      {/* Message d'action */}
      {actionMessage.text && (
        <div className={`action-message ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}
      
      {/* Filtres */}
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-options">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="etudiant">Étudiant</option>
            <option value="instructeur">Instructeur</option>
            <option value="administrateur">Administrateur</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>
      
      {/* Tableau des utilisateurs */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading">Chargement des utilisateurs...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-results">Aucun utilisateur trouvé</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom')}>
                  Nom {sortBy === 'nom' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('prenom')}>
                  Prénom {sortBy === 'prenom' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('role')}>
                  Rôle {sortBy === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('dateCreation')}>
                  Date d'inscription {sortBy === 'dateCreation' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('active')}>
                  Statut {sortBy === 'active' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={!user.active ? 'inactive-user' : ''}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'etudiant' ? 'Étudiant' : 
                       user.role === 'instructeur' ? 'Instructeur' : 
                       user.role === 'administrateur' ? 'Administrateur' : 
                       user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.dateCreation)}</td>
                  <td>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="action-button role"
                      onClick={() => handleRoleChange(user.id)}
                      title="Changer le rôle"
                    >
                      <i className="fa-solid fa-user-tag"></i>
                    </button>
                    <button 
                      className={`action-button ${user.active ? 'disable' : 'enable'}`}
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.active ? 'Désactiver' : 'Réactiver'}
                    >
                      <i className={`fa-solid ${user.active ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                    </button>
                    <button 
                      className="action-button password"
                      onClick={() => handleResetPassword(user.id)}
                      title="Réinitialiser le mot de passe"
                    >
                      <i className="fa-solid fa-key"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modal pour les actions */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalType === 'changeRole' ? 'Changer le rôle' :
                 modalType === 'disable' ? 'Désactiver le compte' :
                 modalType === 'enable' ? 'Réactiver le compte' :
                 modalType === 'resetPassword' ? 'Réinitialiser le mot de passe' :
                 'Action'}
              </h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-content">
              {selectedUser && (
                <div className="user-info">
                  <p>
                    <strong>Utilisateur:</strong> {selectedUser.prenom} {selectedUser.nom}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Rôle actuel:</strong> {selectedUser.role}
                  </p>
                </div>
              )}
              
              {modalType === 'changeRole' && (
                <div className="form-group">
                  <label>Nouveau rôle:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="etudiant">Étudiant</option>
                    <option value="instructeur">Instructeur</option>
                    <option value="administrateur">Administrateur</option>
                  </select>
                </div>
              )}
              
              {modalType === 'disable' && (
                <p className="confirmation-message">
                  Êtes-vous sûr de vouloir désactiver ce compte ? L'utilisateur ne pourra plus se connecter.
                </p>
              )}
              
              {modalType === 'enable' && (
                <p className="confirmation-message">
                  Êtes-vous sûr de vouloir réactiver ce compte ?
                </p>
              )}
              
              {modalType === 'resetPassword' && (
                <div className="form-group">
                  <label>Nouveau mot de passe:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                  />
                  {newPassword && newPassword.length < 6 && (
                    <p className="error-message">
                      Le mot de passe doit contenir au moins 6 caractères.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>Annuler</button>
              
              {modalType === 'changeRole' && (
                <button 
                  className="confirm-button"
                  onClick={confirmRoleChange}
                  disabled={!newRole || newRole === selectedUser?.role}
                >
                  Confirmer
                </button>
              )}
              
              {(modalType === 'disable' || modalType === 'enable') && (
                <button 
                  className="confirm-button"
                  onClick={confirmStatusChange}
                >
                  Confirmer
                </button>
              )}
              
              {modalType === 'resetPassword' && (
                <button 
                  className="confirm-button"
                  onClick={confirmPasswordReset}
                  disabled={!newPassword || newPassword.length < 6}
                >
                  Confirmer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
