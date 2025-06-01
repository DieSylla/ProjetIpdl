package com.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tutoriel")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tutoriel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tuto")
    private Long idTuto;

    @Column(name = "chemin")
    private String chemin;

    @ManyToOne
    @JoinColumn(name = "instructeur")
    private Instructeur instructeur;

    @ManyToOne
    @JoinColumn(name = "matiere")
    private Matiere matiere;

    @Column(name = "titre")
    private String titre;

    @Column(name = "niveau")
    private String niveau;

    @Column(name = "description")
    private String description;

    @Column(name = "duree")
    private String duree;
}
