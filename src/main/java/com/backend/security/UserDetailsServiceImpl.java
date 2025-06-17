package com.backend.security;

import com.backend.model.Administrateur;
import com.backend.model.Etudiant;
import com.backend.model.Instructeur;
import com.backend.repository.AdministrateurRepository;
import com.backend.repository.EtudiantRepository;
import com.backend.repository.InstructeurRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EtudiantRepository etudiantRepository;
    private final InstructeurRepository instructeurRepository;
    private final AdministrateurRepository administrateurRepository;

    public UserDetailsServiceImpl(EtudiantRepository etudiantRepository,
                                  InstructeurRepository instructeurRepository,
                                  AdministrateurRepository administrateurRepository) {
        this.etudiantRepository = etudiantRepository;
        this.instructeurRepository = instructeurRepository;
        this.administrateurRepository = administrateurRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Cherche dans la table administrateur
        Optional<Administrateur> adminOpt = administrateurRepository.findByLogin(username);
        if (adminOpt.isPresent()) {
            Administrateur admin = adminOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    admin.getLogin(),
                    admin.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Cherche dans instructeur
        Optional<Instructeur> instructeurOpt = instructeurRepository.findByMail(username);
        if (instructeurOpt.isPresent()) {
            Instructeur instructeur = instructeurOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    instructeur.getMail(),
                    instructeur.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_INSTRUCTEUR"))
            );
        }

        // Cherche dans etudiant
        Optional<Etudiant> etudiantOpt = etudiantRepository.findByMail(username);
        if (etudiantOpt.isPresent()) {
            Etudiant etudiant = etudiantOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    etudiant.getMail(),
                    etudiant.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ETUDIANT"))
            );
        }

        throw new UsernameNotFoundException("Utilisateur non trouvé : " + username);
    }
}
