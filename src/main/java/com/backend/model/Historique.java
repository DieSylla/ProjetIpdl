package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "historique")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHistorique")
    private Integer idHistorique;

    @ManyToOne
    @JoinColumn(name = "idEtud", nullable = false)
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "id_tuto", nullable = false)
    private Tutoriel tutoriel;

    @Column(name = "date_visionnage", nullable = false)
    private LocalDateTime dateVisionnage;
}
