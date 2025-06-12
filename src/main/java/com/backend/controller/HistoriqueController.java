package com.backend.controller;

import com.backend.model.Historique;
import com.backend.service.HistoriqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historiques")
@CrossOrigin(origins = "*")
public class HistoriqueController {

    private final HistoriqueService historiqueService;

    public HistoriqueController(HistoriqueService historiqueService) {
        this.historiqueService = historiqueService;
    }

    @GetMapping
    public ResponseEntity<List<Historique>> getAllHistoriques() {
        return ResponseEntity.ok(historiqueService.getAllHistoriques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Historique> getHistoriqueById(@PathVariable Integer id) {
        return historiqueService.getHistoriqueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/etudiant/{idEtud}")
    public ResponseEntity<List<Historique>> getHistoriquesByEtudiant(@PathVariable Integer idEtud) {
        return ResponseEntity.ok(historiqueService.getHistoriquesByEtudiantId(idEtud));
    }
    //PAs de PutMapping (Choix personnelle)
    @PostMapping
    public ResponseEntity<Historique> createHistorique(@RequestBody Historique historique) {
        return ResponseEntity.ok(historiqueService.createHistorique(historique));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorique(@PathVariable Integer id) {
        historiqueService.deleteHistorique(id);
        return ResponseEntity.noContent().build();
    }
}
