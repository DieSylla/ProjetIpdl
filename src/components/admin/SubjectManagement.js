import React, { useState, useEffect } from 'react';
import { 
  addSubject, 
  updateSubject, 
  deleteSubject 
} from '../../utils/adminUtils';
import { getTutorials, getSubjects } from '../../utils/dataManager';
import '../../style/admin/subjectManagement.css';

/**
 * Composant de gestion des matières pour l'administrateur
 */
const SubjectManagement = () => {
  // État pour les matières
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  
  // État pour le formulaire
  const [formMode, setFormMode] = useState('add'); // 'add' ou 'edit'
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    description: ''
  });
  
  // État pour les messages
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  
  // État pour le modal de confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  
  // Charger les matières au chargement du composant
  useEffect(() => {
    loadSubjects();
  }, []);
  
  // Filtrer les matières lorsque la recherche change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSubjects(subjects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = subjects.filter(subject => 
        subject.nom.toLowerCase().includes(query) || 
        (subject.description && subject.description.toLowerCase().includes(query))
      );
      setFilteredSubjects(filtered);
    }
  }, [subjects, searchQuery]);
  
  // Charger les matières depuis l'API
  const loadSubjects = () => {
    setLoading(true);
    
    // Récupérer toutes les matières
    const allSubjects = getSubjects();
    setSubjects(allSubjects);
    setFilteredSubjects(allSubjects);
    
    setLoading(false);
  };
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: '',
      nom: '',
      description: ''
    });
    setFormMode('add');
  };
  
  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Récupérer l'administrateur actuel
    const adminId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    if (!adminId) return;
    
    if (formMode === 'add') {
      // Ajouter une nouvelle matière
      const newSubject = addSubject({
        nom: formData.nom,
        description: formData.description
      }, adminId);
      
      if (newSubject) {
        // Mettre à jour la liste des matières
        setSubjects(prev => [...prev, newSubject]);
        
        setActionMessage({
          text: `La matière "${newSubject.nom}" a été ajoutée avec succès.`,
          type: 'success'
        });
        
        // Réinitialiser le formulaire
        resetForm();
      } else {
        setActionMessage({
          text: 'Erreur lors de l\'ajout de la matière. Vérifiez qu\'elle n\'existe pas déjà.',
          type: 'error'
        });
      }
    } else if (formMode === 'edit') {
      // Mettre à jour une matière existante
      const updatedSubject = updateSubject(formData.id, {
        nom: formData.nom,
        description: formData.description
      }, adminId);
      
      if (updatedSubject) {
        // Mettre à jour la liste des matières
        setSubjects(prev => 
          prev.map(s => s.id === updatedSubject.id ? updatedSubject : s)
        );
        
        setActionMessage({
          text: `La matière "${updatedSubject.nom}" a été mise à jour avec succès.`,
          type: 'success'
        });
        
        // Réinitialiser le formulaire
        resetForm();
      } else {
        setActionMessage({
          text: 'Erreur lors de la mise à jour de la matière.',
          type: 'error'
        });
      }
    }
    
    // Effacer le message après 3 secondes
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
  };
  
  // Éditer une matière
  const handleEdit = (subject) => {
    setFormData({
      id: subject.id,
      nom: subject.nom,
      description: subject.description || ''
    });
    setFormMode('edit');
    
    // Faire défiler jusqu'au formulaire
    document.getElementById('subject-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Ouvrir le modal de confirmation de suppression
  const handleDeleteClick = (subject) => {
    // Vérifier si la matière est utilisée par des tutoriels
    const tutorials = getTutorials();
    const isUsed = tutorials.some(tutorial => tutorial.matiere === subject.nom);
    
    setSubjectToDelete({
      ...subject,
      isUsed
    });
    setShowDeleteModal(true);
  };
  
  // Confirmer la suppression
  const confirmDelete = () => {
    if (!subjectToDelete) return;
    
    // Récupérer l'administrateur actuel
    const adminId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    if (!adminId) return;
    
    // Supprimer la matière
    const success = deleteSubject(subjectToDelete.id, adminId);
    
    if (success) {
      // Mettre à jour la liste des matières
      setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
      
      setActionMessage({
        text: `La matière "${subjectToDelete.nom}" a été supprimée avec succès.`,
        type: 'success'
      });
    } else {
      setActionMessage({
        text: 'Erreur lors de la suppression de la matière.',
        type: 'error'
      });
    }
    
    // Fermer le modal
    setShowDeleteModal(false);
    setSubjectToDelete(null);
    
    // Effacer le message après 3 secondes
    setTimeout(() => setActionMessage({ text: '', type: '' }), 3000);
  };
  
  // Fermer le modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSubjectToDelete(null);
  };
  
  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="subject-management">
      <h2>Gestion des Matières</h2>
      
      {/* Message d'action */}
      {actionMessage.text && (
        <div className={`action-message ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}
      
      {/* Formulaire d'ajout/édition */}
      <div className="subject-form-container" id="subject-form">
        <h3>{formMode === 'add' ? 'Ajouter une matière' : 'Modifier une matière'}</h3>
        
        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-group">
            <label htmlFor="nom">Nom de la matière*</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              required
              placeholder="Ex: Mathématiques"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description de la matière"
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {formMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
            </button>
            
            {formMode === 'edit' && (
              <button 
                type="button" 
                className="cancel-button"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Liste des matières */}
      <div className="subjects-list-container">
        <div className="subjects-header">
          <h3>Liste des matières ({filteredSubjects.length})</h3>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une matière..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Chargement des matières...</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="no-results">
            {searchQuery ? 'Aucune matière ne correspond à votre recherche.' : 'Aucune matière n\'a été créée.'}
          </div>
        ) : (
          <div className="subjects-grid">
            {filteredSubjects.map(subject => (
              <div key={subject.id} className="subject-card">
                <div className="subject-header">
                  <h4>{subject.nom}</h4>
                  <div className="subject-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(subject)}
                      title="Modifier"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteClick(subject)}
                      title="Supprimer"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="subject-content">
                  {subject.description ? (
                    <p className="subject-description">{subject.description}</p>
                  ) : (
                    <p className="no-description">Aucune description</p>
                  )}
                </div>
                
                <div className="subject-footer">
                  <span className="subject-date">
                    Créée le {formatDate(subject.dateCreation)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && subjectToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="close-button" onClick={closeDeleteModal}>×</button>
            </div>
            
            <div className="modal-content">
              <p>
                Êtes-vous sûr de vouloir supprimer la matière <strong>"{subjectToDelete.nom}"</strong> ?
              </p>
              
              {subjectToDelete.isUsed && (
                <div className="warning-message">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  <p>
                    Attention : Cette matière est utilisée par un ou plusieurs tutoriels.
                    La supprimer pourrait affecter l'affichage de ces tutoriels.
                  </p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeDeleteModal}>Annuler</button>
              <button className="confirm-button delete" onClick={confirmDelete}>
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
