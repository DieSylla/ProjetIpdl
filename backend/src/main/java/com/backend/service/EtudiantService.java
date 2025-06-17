package com.backend.service;

import com.backend.model.Etudiant;
import com.backend.repository.EtudiantRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final PasswordEncoder passwordEncoder;

    public EtudiantService(EtudiantRepository etudiantRepository, PasswordEncoder passwordEncoder) {
        this.etudiantRepository = etudiantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Etudiant> getAllEtudiants() {
        return etudiantRepository.findAll();
    }

    public Optional<Etudiant> getEtudiantById(Long id) {
        return etudiantRepository.findById(id);
    }

    @Transactional
    public Etudiant createEtudiant(Etudiant etudiant) {
        etudiant.setPassword(passwordEncoder.encode(etudiant.getPassword()));
        return etudiantRepository.save(etudiant);
    }

    @Transactional
    public Etudiant updateEtudiant(Long id, Etudiant etudiant) {
        return etudiantRepository.findById(id)
                .map(existing -> {
                    existing.setMail(etudiant.getMail());
                    if (etudiant.getPassword() != null && !etudiant.getPassword().isEmpty()) {
                        existing.setPassword(passwordEncoder.encode(etudiant.getPassword()));
                    }
                    // Mettre à jour d'autres champs si besoin
                    return etudiantRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Etudiant non trouvé avec id: " + id));
    }

    @Transactional
    public void deleteEtudiant(Long id) {
        etudiantRepository.deleteById(id);
    }
}
