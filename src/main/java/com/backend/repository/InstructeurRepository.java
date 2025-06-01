package com.backend.repository;

import com.backend.model.Instructeur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructeurRepository extends JpaRepository<Instructeur, Long> {
    Optional<Instructeur> findByMail(String mail);
}
