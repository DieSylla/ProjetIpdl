<<<<<<< HEAD
"# ProjetIpdl" 
=======
# Système de Recommandation Vidéo (SRV)

## Présentation du Projet

Le Système de Recommandation Vidéo (SRV) est une plateforme éducative innovante conçue pour offrir aux étudiants un accès personnalisé à des contenus vidéo pédagogiques. Ce projet vise à améliorer l'expérience d'apprentissage en proposant des tutoriels adaptés aux besoins de chaque utilisateur, avec des interfaces modernes et cohérentes pour tous les types d'utilisateurs.

## Objectifs du Projet

- Fournir une interface utilisateur moderne et intuitive pour tous les types d'utilisateurs
- Faciliter l'accès aux tutoriels vidéo éducatifs pour les étudiants
- Offrir aux instructeurs des outils efficaces pour créer et gérer des contenus pédagogiques
- Permettre aux administrateurs de superviser l'ensemble de la plateforme avec des tableaux de bord complets

## Fonctionnalités Principales

### Interface Utilisateur

- **Design responsive** : Adaptation à tous les types d'écrans
- **Thème cohérent** : Interface visuelle harmonisée pour toutes les sections
- **Composants réutilisables** : Architecture modulaire pour faciliter la maintenance
- **Animations et transitions** : Expérience utilisateur fluide et moderne
- **Formulaires améliorés** : Interfaces de saisie intuitives avec validation et feedback visuels

### Interface Administrateur

- **Tableau de bord** : Visualisation des statistiques clés (utilisateurs, tutoriels, activités)
- **Gestion des utilisateurs** : Interface complète pour gérer les comptes, les rôles et les statuts
- **Gestion des matières** : Ajout, modification et suppression des matières disponibles
- **Statistiques détaillées** : Graphiques et tableaux pour analyser l'activité de la plateforme
- **Profil administrateur** : Consultation des informations personnelles du compte administrateur

### Interface Instructeur

- **Tableau de bord personnalisé** : Vue d'ensemble des tutoriels créés et de leur popularité
- **Gestion des tutoriels** : Interface intuitive pour créer, modifier et supprimer des tutoriels
- **Statistiques de visionnage** : Suivi des performances des tutoriels publiés
- **Profil utilisateur** : Gestion des informations personnelles et des statistiques

### Interface Étudiant

- **Tableau de bord étudiant** : Accès rapide aux tutoriels récents et favoris
- **Catalogue de tutoriels** : Navigation et recherche simplifiées dans tous les contenus disponibles
- **Gestion des favoris** : Possibilité de marquer et retrouver facilement les tutoriels préférés
- **Profil personnalisé** : Suivi des activités et préférences de l'utilisateur
- **Lecteur vidéo amélioré** : Interface similaire à YouTube avec contrôles avancés et recommandations

## Nouvelles Fonctionnalités (Mai 2025)

### Améliorations récentes

- **Lecteur vidéo amélioré** : Interface similaire à YouTube avec contrôles avancés
- **Système de recommandation** : Suggestions de vidéos basées sur l'historique de visionnage
- **Commentaires et évaluations** : Possibilité d'interagir avec les tutoriels
- **Recherche avancée** : Filtrage par matière, durée et popularité
- **Interface de connexion modernisée** : Design intuitif avec sélection visuelle des rôles
- **Mémorisation du rôle utilisateur** : Option pour se souvenir du dernier rôle utilisé
- **Récupération de mot de passe** : Fonctionnalité pour réinitialiser un mot de passe oublié
- **Profil administrateur** : Visualisation des informations personnelles pour les administrateurs

## Architecture du Projet

Le projet est développé avec une architecture moderne basée sur React et suit une approche modulaire et componentisée :

### Structure des Composants

- **Composants partagés** : Éléments d'interface réutilisables dans toute l'application
- **Composants spécifiques** : Interfaces dédiées à chaque type d'utilisateur
- **Utilitaires** : Fonctions de gestion des données et de la logique métier

### Organisation du Code

```
src/
├── components/            # Composants React organisés par rôle utilisateur
│   ├── admin/             # Composants pour l'interface administrateur
│   │   ├── AdminPanel.js    # Composant principal de l'interface admin
│   │   ├── Dashboard.js     # Tableau de bord avec statistiques
│   │   ├── UserManagement.js # Gestion des utilisateurs
│   │   └── SubjectManagement.js # Gestion des matières
│   ├── etudiant/          # Composants pour l'interface étudiant
│   │   └── EtudiantPanel.js # Interface principale étudiant
│   ├── instructeur/       # Composants pour l'interface instructeur
│   │   └── InstructeurPanel.js # Interface principale instructeur
│   └── shared/            # Composants partagés entre les interfaces
├── style/                 # Styles CSS organisés par composant
│   ├── admin/             # Styles pour l'interface administrateur
│   │   ├── adminPanel.css   # Style pour le panneau admin
│   │   ├── adminProfile.css # Style pour le profil administrateur
│   │   ├── dashboard.css    # Style pour le tableau de bord
│   │   ├── userManagement.css # Style pour la gestion des utilisateurs
│   │   └── subjectManagement.css # Style pour la gestion des matières
│   ├── etudiant/          # Styles pour l'interface étudiant
│   │   └── etudiantPanel.css # Style pour le panneau étudiant
│   ├── instructeur/       # Styles pour l'interface instructeur
│   │   └── instructeurPanel.css # Style pour le panneau instructeur
│   ├── components/        # Styles pour les composants partagés
│   ├── App.css            # Style global de l'application
│   └── index.css          # Style de base pour l'application
├── utils/                 # Utilitaires et fonctions de gestion des données
│   ├── adminUtils.js      # Fonctions pour l'administration
│   ├── dataManager.js     # Gestion des données (localStorage)
│   ├── adminInitializer.js # Initialisation du compte admin
│   ├── statisticsGenerator.js # Génération des statistiques
│   └── authUtils.js       # Fonctions d'authentification
├── data/                  # Données initiales et configurations
├── pages/                 # Pages principales de l'application
│   ├── VideoBrowser.js    # Navigation dans les tutoriels
│   └── VideoPlayer.js     # Lecteur de tutoriels vidéo
├── Auth/                  # Composants d'authentification
│   ├── login.js           # Gestion de la connexion avec interface moderne
│   └── ForgotPassword.js  # Fonctionnalité de récupération de mot de passe
├── App.js                 # Point d'entrée de l'application et routage
├── index.js               # Initialisation de React
├── register.js            # Inscription des utilisateurs
└── profil.js              # Gestion du profil utilisateur
```

### Description des fichiers principaux

#### Fichiers racine

- **App.js** : Composant principal qui définit les routes de l'application et initialise le compte administrateur au démarrage.
- **index.js** : Point d'entrée de l'application React qui rend le composant App dans le DOM.
- **register.js** : Gère l'inscription des nouveaux utilisateurs avec validation des données.
- **profil.js** : Permet aux utilisateurs de consulter et modifier leurs informations personnelles.

#### Fichiers d'authentification

- **Auth/login.js** : Interface de connexion moderne avec sélection de rôle visuelle et mémorisation du dernier rôle utilisé.
- **Auth/ForgotPassword.js** : Fonctionnalité de récupération de mot de passe pour les utilisateurs qui ont oublié leurs identifiants.

#### Composants d'administration

- **AdminPanel.js** : Interface principale pour les administrateurs avec navigation entre les différents modules.
- **Dashboard.js** : Affiche des statistiques sur les utilisateurs, les tutoriels et l'activité de la plateforme.
- **UserManagement.js** : Interface pour gérer les utilisateurs (ajout, modification, désactivation, changement de rôle).
- **SubjectManagement.js** : Interface pour gérer les matières (ajout, modification, suppression).

#### Composants étudiant et instructeur

- **EtudiantPanel.js** : Interface principale pour les étudiants avec accès aux tutoriels et aux favoris.
- **InstructeurPanel.js** : Interface principale pour les instructeurs avec gestion des tutoriels.

#### Utilitaires

- **adminUtils.js** : Fonctions utilitaires pour les opérations administratives (gestion des utilisateurs, matières).
- **dataManager.js** : Gestion de la persistance des données via localStorage (utilisateurs, tutoriels, matières).
- **statisticsGenerator.js** : Génération de statistiques pour le tableau de bord administrateur.
- **adminInitializer.js** : Création automatique du compte administrateur au premier démarrage.
- **authUtils.js** : Fonctions liées à l'authentification et à la gestion des sessions.

## Technologies Utilisées

- **React** (v18.2.0) : Bibliothèque JavaScript pour la création d'interfaces utilisateur
- **React Router** (v6.10.0) : Gestion du routage côté client
- **CSS Modulaire** : Organisation des styles par composant pour une meilleure maintenabilité
- **Font Awesome** (v6.4.0) : Bibliothèque d'icônes pour une interface utilisateur moderne
- **Google Fonts** : Polices Nunito pour une typographie cohérente et professionnelle
- **LocalStorage API** : Stockage local des données utilisateur et des tutoriels

## Fonctionnalités Avancées

### Gestion des Utilisateurs

- **Système de rôles** : Trois niveaux d'accès (administrateur, instructeur, étudiant)
- **Gestion des comptes** : Activation/désactivation, changement de rôle, réinitialisation de mot de passe
- **Authentification sécurisée** : Validation des identifiants et gestion des sessions

### Gestion des Tutoriels

- **Upload de vidéos** : Interface intuitive pour téléverser et prévisualiser les tutoriels
- **Métadonnées** : Ajout de titres, descriptions, matières et niveaux de difficulté
- **Miniatures** : Personnalisation des images de prévisualisation des tutoriels

### Statistiques et Tableaux de Bord

- **Graphiques interactifs** : Visualisation des données utilisateur et des tutoriels
- **Statistiques en temps réel** : Suivi des vues, des utilisateurs actifs et des tendances
- **Rapports détaillés** : Analyse des performances par instructeur et par matière

## Installation et Configuration

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)

### Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_DEPOT]
   cd ProjetIpdl-frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer l'application en mode développement :
   ```bash
   npm start
   ```
   L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Démarrage de l'Application

Pour lancer l'application en mode développement :

```bash
npm start
```

L'application sera accessible à l'adresse [http://localhost:4000](http://localhost:4000) dans votre navigateur.

Pour les environnements avec des problèmes de compatibilité OpenSSL :

```bash
npm run start-legacy
```

## Utilisation

### Accès à l'Application

Après avoir lancé l'application, accédez à [http://localhost:3000](http://localhost:3000) dans votre navigateur. Vous serez redirigé vers la page d'accueil.

### Connexion

Un compte administrateur est automatiquement créé au premier démarrage de l'application :

- **Administrateur** :
  - Email : admin@srv.com
  - Mot de passe : admin123

Vous pouvez ensuite créer d'autres comptes via l'interface d'administration ou la page d'inscription.

### Interfaces Utilisateur

#### Interface Administrateur

- **Tableau de bord** : Vue d'ensemble des statistiques de la plateforme
- **Gestion des utilisateurs** : Création, modification et gestion des comptes
- **Gestion des matières** : Administration des catégories de tutoriels

#### Interface Instructeur

- **Tableau de bord instructeur** : Statistiques personnelles et tutoriels populaires
- **Gestion des tutoriels** : Création et modification des contenus pédagogiques
- **Profil instructeur** : Gestion des informations personnelles

#### Interface Étudiant

- **Tableau de bord étudiant** : Accès aux tutoriels récents et recommandés
- **Catalogue de tutoriels** : Exploration de tous les contenus disponibles
- **Favoris** : Gestion des tutoriels marqués comme favoris

## Stockage des Données

L'application utilise le localStorage du navigateur pour stocker les données, ce qui permet :

- Une persistance des données entre les sessions
- Un fonctionnement sans backend (mode démonstration)
- Une expérience utilisateur fluide sans latence

Les données stockées comprennent :

- Comptes utilisateurs et informations de profil
- Tutoriels et leurs métadonnées
- Matières et paramètres système
- Statistiques et journaux d'activité

## Évolutions Futures

### Système de Recommandation

Le cœur du projet est son système de recommandation qui analyse :
- Les préférences de l'utilisateur
- L'historique de visionnage
- Le niveau académique
- Les matières suivies

Ces données permettent de proposer des tutoriels pertinents et adaptés au profil de chaque étudiant.

### Gestion des Tutoriels

Les tutoriels sont organisés par :
- Matière (programmation, mathématiques, etc.)
- Niveau de difficulté (débutant, intermédiaire, avancé)
- Durée
- Instructeur

### Personnalisation de l'Interface

L'application offre des options de personnalisation :
- Thème clair/sombre pour améliorer le confort visuel
- Interface adaptée au profil de l'utilisateur

## Perspectives d'Évolution

Le projet SRV est conçu pour évoluer avec les fonctionnalités futures suivantes :

- **Backend dédié** : Migration vers une architecture client-serveur avec API REST
- **Algorithmes de recommandation avancés** : Suggestions personnalisées basées sur les préférences et l'historique
- **Fonctionnalités sociales** : Commentaires, évaluations et partage de tutoriels
- **Système de notifications** : Alertes pour les nouveaux tutoriels et activités
- **Mode hors ligne** : Accès aux tutoriels sans connexion internet
- **Application mobile** : Versions iOS et Android pour un accès mobile optimisé
- **Intégration LMS** : Compatibilité avec les plateformes d'apprentissage existantes (Moodle, Canvas)
- **Analyses avancées** : Outils d'analyse de l'engagement et du progrès des étudiants

## Auteurs

- Équipe de développement IPDL

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

---

&copy; 2025 Système de Recommandation Vidéo (SRV) - Tous droits réservés

## Contribution au Projet

Les contributions au projet sont les bienvenues. Pour contribuer :
1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité
3. Soumettre une pull request avec une description détaillée des modifications

## Licence

Ce projet est sous licence [insérer type de licence]. Voir le fichier LICENSE pour plus de détails.

---

© Système de Recommandation Vidéo (SRV), 2023-2024. Tous droits réservés.
>>>>>>> 1b0cd01 (mise niveau du front avec sidebar)
