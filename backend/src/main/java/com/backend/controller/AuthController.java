package com.backend.controller;

import com.backend.model.*;
import com.backend.repository.*;
import com.backend.security.JwtTokenProvider;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EtudiantRepository etudiantRepository;
    private final InstructeurRepository instructeurRepository;
    private final AdministrateurRepository administrateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          EtudiantRepository etudiantRepository,
                          InstructeurRepository instructeurRepository,
                          AdministrateurRepository administrateurRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.etudiantRepository = etudiantRepository;
        this.instructeurRepository = instructeurRepository;
        this.administrateurRepository = administrateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Vérification ADMIN
        Optional<Administrateur> adminOpt = administrateurRepository.findByLogin(username);
        if (adminOpt.isPresent()) {
            Administrateur admin = adminOpt.get();
            
            if (passwordEncoder.matches(password, admin.getPassword())) {
                String token = jwtTokenProvider.createToken(admin.getLogin(), "ADMIN");
                return ResponseEntity.ok(new ApiResponse(true, token, admin.getLogin(), "ADMIN"));
            } else {
                return unauthorized("Mot de passe incorrect", "ADMIN");
            }
        }

        // Vérification INSTRUCTEUR
        Optional<Instructeur> instructeurOpt = instructeurRepository.findByMail(username);
        if (instructeurOpt.isPresent()) {
            Instructeur instructeur = instructeurOpt.get();
            if (passwordEncoder.matches(password, instructeur.getPassword())) {
                authenticate(username, password);
                String token = jwtTokenProvider.createToken(instructeur.getMail(), "INSTRUCTEUR");
                return ResponseEntity.ok(new ApiResponse(true, token, instructeur.getMail(), "INSTRUCTEUR"));
            } else {
                return unauthorized("Mot de passe incorrect", "INSTRUCTEUR");
            }
        }

        // Vérification ETUDIANT
        Optional<Etudiant> etudiantOpt = etudiantRepository.findByMail(username);
        if (etudiantOpt.isPresent()) {
            Etudiant etudiant = etudiantOpt.get();
            if (passwordEncoder.matches(password, etudiant.getPassword())) {
                authenticate(username, password);
                String token = jwtTokenProvider.createToken(etudiant.getMail(), "ETUDIANT");
                return ResponseEntity.ok(new ApiResponse(true, token, etudiant.getMail(), "ETUDIANT"));
            } else {
                return unauthorized("Mot de passe incorrect", "ETUDIANT");
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, null, "Utilisateur non trouvé", null));
    }

    private void authenticate(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private ResponseEntity<ApiResponse> unauthorized(String message, String role) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, null, message, role));
    }

    @Data
    private static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    private static class ApiResponse {
        private final boolean auth;
        private final String token;
        private final String username;
        private final String role;

        public ApiResponse(boolean auth, String token, String username, String role) {
            this.auth = auth;
            this.token = token;
            this.username = username;
            this.role = role;
        }
    }
}
