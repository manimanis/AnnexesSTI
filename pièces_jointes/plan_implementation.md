# Plan d'Implémentation du Site Web de Cours et d'Exercices STI
**Discipline :** Systèmes & Technologies de l'Informatique (STI) / Développement Web & Bases de Données  
**Public Cible :** Élèves de la Section Sciences de l'Informatique (2ème, 3ème et 4ème Année - Bac SI)  
**Documents de référence :** `programme.md` (Programme officiel Éducation Nationale) et `sommaire.md` (Sommaire du Manuel Scolaire)

---

## 1. Vision et Objectifs Pédagogiques

Le projet consiste à développer une plateforme web éducative interactive et responsive pour l'enseignement et l'apprentissage de la matière **STI** et du **Développement Web & Bases de Données** destinée aux élèves tunisiens de la section **Sciences de l'Informatique**.

### Objectifs Majeurs :
1. **Centraliser les Ressources Pédagogiques :** Offrir des fiches de cours conformes aux directives ministérielles (situations de départ, acquisition des savoirs, synthèses visuelles, cartes mentales).
2. **Dynamiser l'Apprentissage des T.P. :** Mettre à disposition des ateliers d'implémentation intégrant des environnements de code (HTML5, CSS3, JS, PHP, SQL) avec prévisualisation et auto-correction.
3. **Préparation à l'Épreuve du Baccalauréat :** Intégrer des QCM de révision, des exercices de recherche d'anomalies de code et des épreuves de synthèse type Bac.
4. **Couverture Globale STI :** Couvrir la conception web, le développement backend PHP/MySQLi, la modélisation de bases de données, ainsi que les concepts système, réseaux et IoT (ESP32 / MicroPython) spécifiques au programme STI.

---

## 2. Architecture des Contenus du Site

Le contenu pédagogique du site est articulé autour des **5 modules majeurs du manuel** et enrichi par les domaines **Systèmes, Réseaux et IoT** du programme officiel STI.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PLATEFORME PÉDAGOGIQUE STI                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
 ┌──────────────────┬──────────────────┬───┴──────────────┬──────────────────┬───────────┐
 │                  │                  │                  │                  │           │
 ▼                  ▼                  ▼                  ▼                  ▼           ▼
Module 1           Module 2           Module 3           Module 4           Module 5    Module 6 (STI)
HTML5              CSS3               JavaScript         Bases de Données   PHP & MySQL  Systèmes, Réseaux
Sémantique &       Style, Layout &    Client & DOM       (BDR & SQL)        Web          & IoT ESP32
Formulaires        Animations                            LDD / LMD          Dynamique
```

### Détail des Modules Pédagogiques :

#### Module 1 : Création et Structuration de Documents Web (HTML5)
* **Chapitre 1 : Les Fondements du Web Sémantique**
  * Structure de base (`<!doctype>`, `<html>`, `<head>`, `<body>`).
  * Balises sémantiques (`<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>`).
  * Multimédia (`<figure>`, `<figcaption>`, `<source>`, `<img>`, `<audio>`, `<video>`).
  * Arborescence DOM et validation du code via validateurs W3C.
* **Chapitre 2 : Formulaires et Interactivité Multimédia**
  * Champs de formulaire avancés (`date`, `time`, `email`, `tel`, `password`, `range`, `button`).
  * Élément `<datalist>` pour choix suggérés.
  * Événements HTML (`onkeydown`, `onkeyup`, `onmouseover`, `onmouseout`, `onplay`, `onpause`, `onsubmit`, `onchange`).

#### Module 2 : Mise en Forme et Animation Visuelle (CSS3)
* **Chapitre 1 : Sélecteurs et Propriétés Visuelles de Base**
  * Syntaxe d'une règle (déclaration, sélecteur, propriété, valeur).
  * Sélecteurs : élément, identifiant (`#id`), classe (`.class`), groupe (`,`), universel (`*`), attributs (`[attr=val]`).
  * Propriétés de texte, bordures, arrière-plans. Méthodes d'intégration : inline, interne (`<style>`), externe (`<link>`).
* **Chapitre 2 : Positionnement, Transformations et Animations**
  * Propriétés de boîtes (`width`, `height`, `position`, `float`, `margin`, `padding`, `display`).
  * Transformations 2D (`rotate()`, `skew()`, `scale()`, `translate()`).
  * Animations `@keyframes` et super-propriétés `transition` et `animation`.
  * Sélecteurs d'état (`:hover`, `:focus`, `:link`, `:visited`).

#### Module 3 : Interactivité Côté Client avec JavaScript (JS)
* **Chapitre 1 : Fondamentaux, Variables et Structures de Contrôle**
  * Déclaration (`let`, `const`), portée locale/globale.
  * Types de données : `string`, `number`, `boolean`, `array`, `date`.
  * Structures conditionnelles (`if`, `switch`) et itératives (`for`, `while`, `do...while`).
  * Objets globaux (`Math`, `Date`, `String`, `Array`).
* **Chapitre 2 : Manipulation du DOM et Événements**
  * Sélection (`getElementById`, `getElementsByName`).
  * Entrées/sorties (`prompt`, `alert`, `innerHTML`, `document.write`).
  * Modification du contenu, des attributs (`src`, `disabled`, `checked`) et des styles inline CSS.
  * Validation interactive des formulaires côté client sans attribut `pattern`.

#### Module 4 : Conception et Gestion des Bases de Données (BDR & SQL)
* **Chapitre 1 : Modélisation et Langage de Définition des Données (LDD)**
  * Concept BDR : tables, clés primaires/étrangères, cardinalités (1:1, 1:∞, ∞:∞).
  * Contraintes d'intégrité (table, domaine, référentielle, `NOT NULL`, `DEFAULT`, `CHECK`, `CASCADE`).
  * Requêtes LDD SQL (`CREATE DATABASE`, `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`).
  * Évaluation et correction de schémas relationnels textuels et graphiques.
* **Chapitre 2 : Langage de Manipulation et d'Interrogation des Données (LMD)**
  * Requêtes de mise à jour (`INSERT INTO`, `UPDATE`, `DELETE FROM`).
  * Requêtes d'interrogation (`SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY`).
  * Requêtes multi-tables (jointures), requêtes imbriquées (sous-requêtes non corrélées dans `WHERE`) et fonctions agrégats (`AVG`, `COUNT`, `MAX`, `MIN`, `SUM`).

#### Module 5 : Développement Dynamique avec PHP & MySQL
* **Chapitre 1 : Serveur, Syntaxe et Transmission de Données**
  * Cycle de vie HTTP (Client ➔ Serveur Web ➔ Traitement PHP ➔ Rendu HTML).
  * Syntaxe PHP, variables, typage, transtypage (`(int)`, `(string)`), tableaux indicés et associatifs.
  * Inclusions de fichiers via `require()`.
  * Transmissions de données via formulaires HTTP (`$_GET` et `$_POST`).
* **Chapitre 2 : Interaction avec une Base de Données MySQL**
  * Extension MySQLi procédurale (`mysqli_connect`, `mysqli_query`, `mysqli_fetch_array`, `mysqli_fetch_row`, `mysqli_num_rows`, `mysqli_affected_rows`, `mysqli_error`, `mysqli_close`).
  * Développement d'applications web dynamiques sécurisées (authentification, tableaux de bord de résultats, CRUD).

#### Module 6 : Systèmes, Réseaux et IoT (Spécifique STI 3ème & 4ème SI)
* **Systèmes d'Exploitation :** Typologie (PC, Mobile, Embarqué), virtualisation (VMware), sécurité (pare-feu, antivirus).
* **Réseaux :** Typologies (LAN, MAN, WAN), adressage (IP, DNS, Masque, MAC), architectures Client/Serveur et P2P.
* **Objets Connectés (IoT) :** Carte ESP32, programmation en MicroPython / Arduino C++, gestion des capteurs (température, humidité, obstacle) et actionneurs (LED, servomoteur, buzzer).

---

## 3. Architecture Technique du Site Web

La plateforme fonctionnera sur un environnement léger et standard (compatible WAMP / XAMPP / LAMP) respectant les outils travaillés en classe par les élèves.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT (Navigateur Web)                            │
│  - Interface Responsive HTML5 / CSS3 (CSS Grid, Flexbox, Animations)           │
│  - Interactivité JS (ES6, DOM, AJAX)                                           │
│  - Éditeur de Code Intégré (Monaco Editor / CodeMirror)                        │
└────────────────────────────────────────────────────────────────────────────────┘
                                      │  ▲
                         Requêtes HTTP│  │Réponses HTML/JSON
                                      ▼  │
┌────────────────────────────────────────────────────────────────────────────────┐
│                         SERVEUR WEB (Apache / PHP 8+)                          │
│  - Contrôleurs PHP (Gestion des cours, QCM, évaluations, soumissions)          │
│  - Moteur de Validation de Code (HTML5/CSS3 Validator, SQL Parser)            │
│  - API JSON pour ateliers interactifs                                          │
└────────────────────────────────────────────────────────────────────────────────┘
                                      │  ▲
                           MySQLi /   │  │Résultats
                           PDO        ▼  │
┌────────────────────────────────────────────────────────────────────────────────┐
│                           BASE DE DONNÉES (MySQL)                              │
│  - Schéma relationnel (Utilisateurs, Cours, Exercices, QCM, Progression)       │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Spécifications Frontend :
* **Technologies :** HTML5 Sémantique, CSS3 (Variables CSS, Flexbox/Grid, animations `@keyframes`), JavaScript ES6+.
* **Aesthétique & Design UI/UX :**
  * Palette de couleurs moderne (Thème sombre/clair adaptatif, accents bleus/cyan tech).
  * Typographie soignée (Police Inter ou Roboto).
  * Design réactif et fluide avec transitions interactives sur les boutons et cartes d'exercices.
* **Éditeur de code intégré :** Intégration d'un composant de saisie de code avec coloration syntaxique (Monaco Editor ou CodeMirror) pour HTML, CSS, JS, PHP et SQL.

### Spécifications Backend :
* **Langage :** PHP 8.x (Architecture MVC modulable sans framework lourd).
* **Extension BDR :** Extension MySQLi procédurale (pour rester aligné sur les pratiques exigées au Bac SI) + PDO pour la couche d'administration.
* **Sécurité :** Validation stricte des entrées, filtrage des requêtes SQL de test dans un bac à sable isolé (sandbox DB).

---

## 4. Modélisation de la Base de Données de la Plateforme (`sti_db`)

### Représentation Textuelle des Relations :
* **`UTILISATEUR`** (<ins>id_user</ins>, nom, prenom, email, mot_de_passe, role, date_creation)
* **`MODULE`** (<ins>id_module</ins>, titre, description, ordre, niveau)
* **`CHAPITRE`** (<ins>id_chapitre</ins>, titre, situation_depart, ordre, #id_module)
* **`COURS`** (<ins>id_cours</ins>, titre, contenu_html, savoirs_associes, fiche_synthese, #id_chapitre)
* **`EXERCICE`** (<ins>id_exercice</ins>, titre, enonce, type_exercice, niveau_difficulte, solution_code, #id_chapitre)
* **`QCM_QUESTION`** (<ins>id_question</ins>, enonce, explication, #id_chapitre)
* **`QCM_OPTION`** (<ins>id_option</ins>, texte_option, est_correcte, #id_question)
* **`PROGRESSION`** (<ins>#id_user</ins>, <ins>#id_chapitre</ins>, statut, note_qcm, date_derniere_visite)

---

## 5. Fonctionnalités Clés et Espaces Utilisateurs

### 1. Espace Apprenant (Élève)
* **Tableau de bord personnalisé :** Jauge de progression globale par module, derniers cours consultés et badges d'accomplissement.
* **Lecteur de Cours Interactif :**
  * Vue structurée par chapitre avec Situation de départ, Acquisition des savoirs, Synthèse sous forme de cartes mentales et Fiches mémorielles (tables d'annexes HTML5/CSS3/JS/PHP/SQL intégrées).
* **Bac à Sable "Code Lab" (HTML/CSS/JS) :**
  * Zone d'édition tri-panneaux (HTML, CSS, JS) avec prévisualisation en direct (`<iframe>`) pour tester instantanément les ateliers d'implémentation.
* **Simulateur SQL & PHP :**
  * Console SQL interactive permettant aux élèves d'exécuter des requêtes `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE` sur une base d'entraînement et d'observer le résultat tabulaire ou les erreurs MySQLi.
* **Espace Évaluation & Annales Bac :**
  * Module de QCM chronométré avec correction instantanée et feedback explicatif.
  * Exercices de détection de bugs (anomalies dans un script JS, jointure SQL erronée, erreur de portée de variable PHP).
  * Sujets de synthèse corrigés type Baccalauréat.

### 2. Espace Enseignant / Administrateur
* **Gestion du Contenu (CMS Pédagogique) :** Création et modification des cours, chapitres, exercices et QCM.
* **Suivi de la Classe :** Consultation des résultats des élèves aux QCM et des statistiques de complétion des modules.

---

## 6. Plan de Déploiement et Phases d'Implémentation

```
Phase 1: Architecture & UI/UX  [Semaines 1-2]
Phase 2: Intégration Contenus  [Semaines 3-5]
Phase 3: Backend & Moteur BDR  [Semaines 6-8]
Phase 4: Code Lab & QCM Inter. [Semaines 9-10]
Phase 5: Recette & Val. W3C    [Semaines 11-12]
```

### Calendrier détaillé :

#### Phase 1 : Conception & Modélisation (Semaines 1 - 2)
- [x] Analyse approfondie du programme officiel (`programme.md`) et du sommaire manuel (`sommaire.md`).
- [x] Conception du schéma relationnel MySQL (`sti_db`) et création des tables LDD (`pièces_jointes/schema_sti_db.sql`).
- [x] Élaboration des maquettes UI/UX de la plateforme (`index.html`, `cours.html`, `code_lab.html`, `console_sql.html`).

#### Phase 2 : Développement du Frontend & Intégration du Contenu (Semaines 3 - 5)
- [ ] Création du système de design CSS (Variables, thèmes, typographie, composants réutilisables).
- [ ] Intégration des cours des 5 modules + Module STI (Systèmes, Réseaux, IoT).
- [ ] Intégration des tables récapitulatives en annexes (Balises HTML5, Propriétés CSS3, Fonctions JS/PHP/SQL).

#### Phase 3 : Développement du Backend PHP & Base de Données (Semaines 6 - 8)
- [ ] Implémentation du système d'authentification et de gestion de session.
- [ ] Développement des scripts PHP/MySQLi pour l'affichage dynamique des cours et la gestion de la progression.
- [ ] Création du moteur de gestion des QCM et du calcul des scores.

#### Phase 4 : Ateliers Interactifs & Bac à Sable de Code (Semaines 9 - 10)
- [ ] Intégration du "Code Lab" frontend (HTML/CSS/JS avec rendu en temps réel).
- [ ] Déploiement de l'exécuteur de requêtes SQL de test (Sandbox MySQLi sécurisée).
- [ ] Mise en place du module de simulation des requêtes HTTP `$_GET` et `$_POST` pour PHP.

#### Phase 5 : Validation, Tests et Optimisation (Semaines 11 - 12)
- [ ] Recette pédagogique : Vérification de la conformité de chaque chapitre avec les compétences exigées au Bac SI.
- [ ] Validation du code généré avec les outils de validation HTML5 et CSS3 du W3C.
- [ ] Tests d'ergonomie sur ordinateurs et tablettes d'établissement scolaire.

---

## 7. Plan de Vérification et Critères de Qualité

### 1. Vérification de la Conformité Pédagogique :
* Chaque chapitre doit comporter une **situation de départ**, des **acquisitions de savoirs**, un **atelier d'implémentation**, une **synthèse** et une **évaluation**.
* Couverture à 100% des éléments des annexes (HTML5, CSS3, JS, PHP, SQL).

### 2. Validation Technique :
* **HTML5 / CSS3 :** Aucune erreur ou avertissement lors du passage au validateur W3C.
* **JavaScript :** Exécution sans exception console; respect du strict mode.
* **PHP / MySQLi :** Fermeture explicite des connexions (`mysqli_close`), gestion propre des erreurs `mysqli_error`, et sécurité anti-injection SQL.

---
*Plan rédigé et enregistré dans `pièces_jointes/plan_implementation.md` pour le projet de manuel et plateforme STI.*
