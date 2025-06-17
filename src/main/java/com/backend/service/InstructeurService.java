package com.backend.service;

import com.backend.model.Instructeur;
import com.backend.repository.InstructeurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InstructeurService {

    private final InstructeurRepository instructeurRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructeurService(InstructeurRepository instructeurRepository, PasswordEncoder passwordEncoder) {
        this.instructeurRepository = instructeurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Instructeur> getAllInstructeurs() {
        return instructeurRepository.findAll();
    }

    public Optional<Instructeur> getInstructeurById(Long id) {
        return instructeurRepository.findById(id);
    }

    @Transactional
    public Instructeur createInstructeur(Instructeur instructeur) {
        instructeur.setPassword(passwordEncoder.encode(instructeur.getPassword()));
        return instructeurRepository.save(instructeur);
    }

    @Transactional
    public Instructeur updateInstructeur(Long id, Instructeur instructeur) {
        return instructeurRepository.findById(id)
                .map(existing -> {
                    existing.setMail(instructeur.getMail());
                    if (instructeur.getPassword() != null && !instructeur.getPassword().isEmpty()) {
                        existing.setPassword(passwordEncoder.encode(instructeur.getPassword()));
                    }
                    // Mettre à jour d'autres champs si besoin
                    return instructeurRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Instructeur non trouvé avec id: " + id));
    }

    @Transactional
    public void deleteInstructeur(Long id) {
        instructeurRepository.deleteById(id);
    }
}
