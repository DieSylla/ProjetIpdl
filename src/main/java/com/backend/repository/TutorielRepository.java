package com.backend.repository;

import com.backend.model.Tutoriel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TutorielRepository extends JpaRepository<Tutoriel, Long> {
    // Ici, la propriété dans Tutoriel est 'matiere', et la clé primaire de Matiere est 'idMat' (à vérifier dans l'entité Matiere)
    List<Tutoriel> findByMatiereIdMat(Integer idMat);

    // La propriété dans Tutoriel est 'instructeur' et la clé primaire dans Instructeur est 'idInstructeur'
    List<Tutoriel> findByInstructeurIdInstructeur(Long idInstructeur);
}
