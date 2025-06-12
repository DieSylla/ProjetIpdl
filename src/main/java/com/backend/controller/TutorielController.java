package com.backend.controller;

import com.backend.model.Tutoriel;
import com.backend.service.TutorielService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutoriels")
@CrossOrigin(origins = "*")
public class TutorielController {

    private final TutorielService tutorielService;

    public TutorielController(TutorielService tutorielService) {
        this.tutorielService = tutorielService;
    }

    @GetMapping
    public ResponseEntity<List<Tutoriel>> getAllTutoriels() {
        return ResponseEntity.ok(tutorielService.getAllTutoriels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutoriel> getTutorielById(@PathVariable Long id) {
        return tutorielService.getTutorielById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matiere/{idMat}")
    public ResponseEntity<List<Tutoriel>> getTutorielsByMatiere(@PathVariable Integer idMat) {
        return ResponseEntity.ok(tutorielService.getTutorielsByMatiere(idMat));
    }

    @GetMapping("/instructeur/{idInstructeur}")
    public ResponseEntity<List<Tutoriel>> getTutorielsByInstructeur(@PathVariable Long idInstructeur) {
        return ResponseEntity.ok(tutorielService.getTutorielsByInstructeur(idInstructeur));
    }

    @PostMapping
    public ResponseEntity<Tutoriel> createTutoriel(@RequestBody Tutoriel tutoriel) {
        return ResponseEntity.ok(tutorielService.createTutoriel(tutoriel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutoriel> updateTutoriel(@PathVariable Long id, @RequestBody Tutoriel tutoriel) {
        try {
            return ResponseEntity.ok(tutorielService.updateTutoriel(id, tutoriel));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutoriel(@PathVariable Long id) {
        tutorielService.deleteTutoriel(id);
        return ResponseEntity.noContent().build();
    }
}
