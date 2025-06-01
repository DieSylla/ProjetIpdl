package com.backend.controller;

import com.backend.model.Instructeur;
import com.backend.service.InstructeurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructeurs")
@CrossOrigin(origins = "*")
public class InstructeurController {

    private final InstructeurService instructeurService;

    public InstructeurController(InstructeurService instructeurService) {
        this.instructeurService = instructeurService;
    }

    @GetMapping
    public ResponseEntity<List<Instructeur>> getAllInstructeurs() {
        return ResponseEntity.ok(instructeurService.getAllInstructeurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instructeur> getInstructeurById(@PathVariable Long id) {
        return instructeurService.getInstructeurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Instructeur> createInstructeur(@RequestBody Instructeur instructeur) {
        Instructeur created = instructeurService.createInstructeur(instructeur);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Instructeur> updateInstructeur(@PathVariable Long id, @RequestBody Instructeur instructeur) {
        try {
            Instructeur updated = instructeurService.updateInstructeur(id, instructeur);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructeur(@PathVariable Long id) {
        instructeurService.deleteInstructeur(id);
        return ResponseEntity.noContent().build();
    }
}
