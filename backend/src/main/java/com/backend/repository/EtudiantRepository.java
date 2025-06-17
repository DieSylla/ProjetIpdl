package com.backend.repository;

import com.backend.model.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {  
    Optional<Etudiant> findByMail(String mail);
}
