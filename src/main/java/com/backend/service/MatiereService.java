package com.backend.service;

import com.backend.model.Matiere;
import com.backend.repository.MatiereRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {

    private final MatiereRepository matiereRepository;

    public MatiereService(MatiereRepository matiereRepository) {
        this.matiereRepository = matiereRepository;
    }

    public List<Matiere> getAllMatieres() {
        return matiereRepository.findAll();
    }

    public Optional<Matiere> getMatiereById(Integer id) {
        return matiereRepository.findById(id);
    }

    @Transactional
    public Matiere createMatiere(Matiere matiere) {
        return matiereRepository.save(matiere);
    }

    @Transactional
    public Matiere updateMatiere(Integer id, Matiere matiere) {
        return matiereRepository.findById(id)
                .map(existing -> {
                    existing.setNomMat(matiere.getNomMat());
                    return matiereRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Matière non trouvée avec id: " + id));
    }

    @Transactional
    public void deleteMatiere(Integer id) {
        matiereRepository.deleteById(id);
    }
}
