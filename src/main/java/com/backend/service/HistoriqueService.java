package com.backend.service;

import com.backend.model.Historique;
import com.backend.repository.HistoriqueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class HistoriqueService {

    private final HistoriqueRepository historiqueRepository;

    public HistoriqueService(HistoriqueRepository historiqueRepository) {
        this.historiqueRepository = historiqueRepository;
    }

    public List<Historique> getAllHistoriques() {
        return historiqueRepository.findAll();
    }

    public Optional<Historique> getHistoriqueById(Integer id) {
        return historiqueRepository.findById(id);
    }

    public List<Historique> getHistoriquesByEtudiantId(Integer idEtud) {
        return historiqueRepository.findByEtudiantIdEtud(idEtud);
    }

    @Transactional
    public Historique createHistorique(Historique historique) {
        return historiqueRepository.save(historique);
    }

    @Transactional
    public void deleteHistorique(Integer id) {
        historiqueRepository.deleteById(id);
    }
}
