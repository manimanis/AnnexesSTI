# 📚 Portail Numérique des Annexes Officielles - Informatique (Section SI - Tunisie)

[![Programme Officiel](https://img.shields.io/badge/Programme-Officiel%20Bac%20SI%20Tunisie-blue.svg)](https://www.education.gov.tn/)
[![Technologies](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20PHP%20%7C%20SQL-orange.svg)](#-modules-de-révision)
[![Licence](https://img.shields.io/badge/Licence-P%C3%A9dagogique-green.svg)](#)

> **Plateforme Pédagogique Interactive et Modulaire de Révision** conçue pour les élèves de **2ème, 3ème et 4ème Année Secondaire** (Section *Sciences de l'Informatique* - Ministère de l'Éducation de Tunisie).

---

## 🌟 Présentation du Projet

Ce projet centralise et synthétise l'ensemble des connaissances et savoirs exigés au **Baccalauréat informatique tunisien**. Il offre aux enseignants et aux élèves une suite de fiches de révision numériques interactives, structurées et enrichies d'exemples pratiques, de mises en garde et d'avertissements de pièges classiques de l'épreuve.

---

## 🛠️ Modules de Révision

La plateforme est composée de **5 modules indépendants** accessibles directement depuis le portail d'accueil (`index.html`) :

### 1. 🌐 Module HTML5 (`html5.html`)
- **Structure Sémantique** : `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.
- **Formulaires & Éléments de Saisie** : `<input>` (text, password, number, email, date, radio, checkbox, submit, reset), `<select>`, `<option>`, `<textarea>`.
- **Événements HTML Natifs** : 13 événements gérés (`onclick`, `onchange`, `onsubmit`, `onkeyup`, `onmouseover`, etc.).
- **Multimédia & Tableaux** : Balises `<audio>`, `<video>`, `<table>`, `<tr>`, `<th>`, `<td>`, `<ul>`, `<ol>`.

### 2. 🎨 Module CSS3 (`css3.html`)
- **Sélecteurs & Attributs** : Sélecteurs de balise, de classe (`.class`), d'ID (`#id`), d'attributs et pseudo-classes (`:hover`, `:focus`, `:nth-child`).
- **Modèle de Boîte (Box Model)** : `margin`, `padding`, `border`, `width`, `height`, `box-sizing`.
- **Mise en Forme & Arrière-plans** : Typographie, couleurs HSL/Hexa, dégradés (`linear-gradient`), `background-image`.
- **Animations & Effets** : Transitions (`transition`), animations `@keyframes`, filtres graphiques et super-propriétés (*shorthands*).

### 3. ⚡ Module JavaScript (`js.html`)
- **Syntaxe & Contrôle** : Variables (`let`, `const`, `var`), opérateurs, structures conditionnelles et itératives.
- **Entrées / Sorties** : `alert()`, `prompt()`, `confirm()`, `console.log()`.
- **Manipulation du DOM** : `document.getElementById()`, `querySelector()`, modification de contenu (`innerHTML`, `textContent`) et styles dynamiques.
- **Objets Natifs & Casting** : Conversion de types (`parseInt`, `parseFloat`), méthodes des objets `Math`, `String` et `Date`.

### 4. 🐘 Module PHP (`php.html`)
- **Variables & Syntaxe** : Types de données, tableaux indicés et associatifs, structures de contrôle.
- **Transmission HTTP** : Superglobales `$_GET` et `$_POST` pour le traitement des formulaires.
- **Extension MySQLi Procédurale** : `mysqli_connect()`, `mysqli_query()`, `mysqli_fetch_array()`, `mysqli_num_rows()`, `mysqli_close()`.
- **Fonctions Systèmes** : Traitements de chaînes (`strlen`, `substr`, `strtolower`) et de dates (`time`, `date`).

### 5. 🗄️ Module SQL & BDR (`sql.html`)
- **Concepts BDR** : BD/SGBD, représentation relationnelle textuelle (`PK <u>soulignée</u>` et `FK #`), les 3 contraintes d'intégrité (Table, Domaine, Référentielle).
- **Définition de Données (DDL)** : `CREATE DATABASE / USE`, `CREATE TABLE`, toutes les variations d' `ALTER TABLE` (`ADD COLUMN`, `MODIFY`, `DROP COLUMN`, `ADD CONSTRAINT`, `DROP CONSTRAINT`, `ALTER COLUMN SET/DROP DEFAULT`, `RENAME`, `ENABLE/DISABLE`), `DROP TABLE`.
- **Contraintes d'Intégrité SQL** : `PRIMARY KEY`, `FOREIGN KEY ... REFERENCES (CASCADE/RESTRICT)`, `NOT NULL`, `UNIQUE`, `CHECK` (exexmples complets), `DEFAULT`, `AUTO_INCREMENT`.
- **Manipulation (DML)** : `INSERT INTO ... VALUES`, `UPDATE ... SET ... WHERE`, `DELETE FROM ... WHERE`.
- **Interrogation (DQL)** : Les 5 clauses canoniques en ordre strict (`1. SELECT...FROM`, `2. WHERE`, `3. GROUP BY`, `4. HAVING`, `5. ORDER BY`).
- **Jointures & Fonctions** : Jointures multi-tables officielles Bac (sans mot-clé `JOIN`), fonctions d'agrégation (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`), de dates (`NOW`, `CURDATE`, `YEAR`, `MONTH`, `DAY`, `ADDDATE`, `DATEDIFF`), de textes (`CONCAT`, `UPPER`, `LOWER`, `LENGTH`, `SUBSTRING`, `TRIM`) et calculs (`ROUND`, `TRUNCATE`, `MOD`, `ABS`).
- **Compatibilité MariaDB / XAMPP** : Notes explicites d'incompatibilité sous XAMPP (ex: `SET FOREIGN_KEY_CHECKS = 0;`, `CHANGE` au lieu de `RENAME COLUMN`, `DROP FOREIGN KEY`).

---

## ⚡ Fonctionnalités Clés

- ⚖️ **Distribution Équilibrée sur 2 Colonnes** : Algorithme dynamique garantissant une hauteur égale entre la colonne gauche et la colonne droite.
- 🔍 **Recherche et Filtrage en Temps Réel** : Moteur de recherche instantané par mot-clé et filtrage dynamique par catégories.
- 🔍 **Fenêtre Modale Interactive** : Modal détaillée avec coloration syntaxique des exemples de code et conseils pédagogiques.
- 🌓 **Mode Sombre / Mode Clair** : Basculement fluide de thème visuel avec persistance dans le `localStorage`.
- 📖 **Sommaire Flottant (Offcanvas)** : Sommaire latéral accessible à tout moment pour une navigation rapide.
- 🖨️ **Mode Impression Dédié (`@media print`)** : CSS optimisé pour une impression papier ou une exportation PDF parfaite (masquage automatique de la navbar, des boutons et des barres d'outils).
- 🎨 **Icônes SVG Vectorielles** : Intégration des logos officiels (`html-5.svg`, `css-3.svg`, `js.svg`, `php.svg`, `database.svg`) dans la navbar, les badges et les cartes.

---

## 💻 Technologies Utilisées

| Composant | Technologie |
| :--- | :--- |
| **Structure & Vues** | HTML5 / Vue.js 3 (Options API) |
| **Styles & Layout** | CSS3 Vanilla (Design Tokens, Dark Mode, `@media print`) & Bootstrap 5 |
| **Données JSON** | Fichiers de données structurées (`jsons/*.json`) |
| **Icônes** | SVG vectoriels (`assets/img/`) & Bootstrap Icons |
| **SGBD de référence** | MySQL / MariaDB (Environnement XAMPP) |

---

## 📄 Licence & Crédits

- **Ministère de l'Éducation de Tunisie** - Section Sciences de l'Informatique.
- Conçu et développé pour la révision et l'accompagnement pédagogique des élèves du secondaire.
