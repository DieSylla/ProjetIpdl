package com.backend.service;

import com.backend.model.Tutoriel;
import com.backend.repository.TutorielRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TutorielService {

    private final TutorielRepository tutorielRepository;

    public TutorielService(TutorielRepository tutorielRepository) {
        this.tutorielRepository = tutorielRepository;
    }

    public List<Tutoriel> getAllTutoriels() {
        return tutorielRepository.findAll();
    }

    public Optional<Tutoriel> getTutorielById(Long id) {
        return tutorielRepository.findById(id);
    }

    public List<Tutoriel> getTutorielsByMatiere(Integer idMat) {
        return tutorielRepository.findByMatiereIdMat(idMat);
    }

    public List<Tutoriel> getTutorielsByInstructeur(Long idInstructeur) {
        return tutorielRepository.findByInstructeurIdInstructeur(idInstructeur);
    }

    @Transactional
    public Tutoriel createTutoriel(Tutoriel tutoriel) {
        return tutorielRepository.save(tutoriel);
    }

    @Transactional
    public Tutoriel updateTutoriel(Long id, Tutoriel tutoriel) {
        return tutorielRepository.findById(id)
                .map(existing -> {
                    existing.setTitre(tutoriel.getTitre());
                    existing.setDescription(tutoriel.getDescription());
                    existing.setNiveau(tutoriel.getNiveau());
                    existing.setDuree(tutoriel.getDuree());
                    existing.setChemin(tutoriel.getChemin());
                    existing.setInstructeur(tutoriel.getInstructeur());
                    existing.setMatiere(tutoriel.getMatiere());
                    return tutorielRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Tutoriel non trouvé avec id: " + id));
    }

    @Transactional
    public void deleteTutoriel(Long id) {
        tutorielRepository.deleteById(id);
    }
}
