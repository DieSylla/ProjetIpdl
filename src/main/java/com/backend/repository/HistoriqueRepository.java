package com.backend.repository;

import com.backend.model.Historique;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoriqueRepository extends JpaRepository<Historique, Integer> {
    List<Historique> findByEtudiantIdEtud(Integer idEtud);
}
