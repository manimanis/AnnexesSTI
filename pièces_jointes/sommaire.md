# Sommaire Détaillé du Manuel de Développement Web et Bases de Données

**Volume ciblé :** 200 pages
**Public cible :** Élèves en préparation de l'épreuve du baccalauréat.

---

## Module 1 : Création et Structuration de Documents Web (HTML5)

### Chapitre 1 : Les Fondements du Web Sémantique

* **Situation de départ :** Le club d'informatique du lycée souhaite créer son premier portail web pour présenter ses activités aux autres élèves.
* **Acquisition des savoirs :**
* Identification de la structure de base d'une page web via les balises `<!doctype>`, `<html>`, `<head>` et `<body>`.
* Organisation sémantique du contenu avec les éléments `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>` et `<aside>`.
* Intégration d'éléments multimédias à l'aide des balises `<figure>`, `<figcaption>` et `<source>`.
* Utilisation d'infographies didactiques pour modéliser l'arborescence du DOM d'une page web.


* **Ateliers d'implémentation :**
* Création de la page d'accueil du club en exploitant un éditeur Web WYSIWYG intégrant le HTML5.
* Habituer les apprenants à indenter et formater correctement le code.
* Il est essentiel d'habituer les apprenants à commenter les solutions.

* **Synthèse :** Carte mentale regroupant les conteneurs HTML de premier niveau et de structuration de texte.

* **Évaluation :**
* Utiliser des outils de validation du contenu des pages web pour s'assurer de la validité du code HTML5.
* Corriger les erreurs et les avertissements détectés par les validateurs.
* Problème type baccalauréat : structurer sémantiquement une page de présentation d'un projet de fin d'année.


### Chapitre 2 : Formulaires et Interactivité Multimédia

* **Situation de départ :** Mettre en place un espace de pré-inscription en ligne pour la journée portes ouvertes de l'établissement.
* **Acquisition des savoirs :**
* Création de formulaires en intégrant les éléments d'entrée : `date`, `time`, `email`, `tel`, `password`, `range` et `button`.


* Intégration de l'élément `<datalist>` dans une page web pour proposer une liste d'options prédéfinies.


* Exploitation des événements HTML pour améliorer l'interactivité, tels que `onkeydown`, `onkeyup`, `onmouseover`, `onmouseout`, `onplay` et `onpause`.




* **Ateliers d'implémentation :**
* Réalisation du formulaire d'inscription avec une structuration stricte.
* Mise en pratique des obligations d'indentation et d'ajout de commentaires descriptifs.




* **Synthèse :** Fiche visuelle reliant chaque type d'`<input>` aux attributs génériques et spécifiques qui lui correspondent.


* **Évaluation :** QCM sur l'identification des événements, et exercice de détection d'anomalies de conception dans un formulaire complexe.

---

## Module 2 : Mise en Forme et Animation visuelle (CSS3)

### Chapitre 1 : Sélecteurs et Propriétés Visuelles de Base

* **Situation de départ :** L'interface du site web du lycée manque d'attrait visuel ; il est nécessaire d'appliquer une charte graphique pour la rendre plus esthétique.
* **Acquisition des savoirs :**
* Reconnaissance de la syntaxe d'une règle CSS3 incluant la déclaration, le sélecteur, la propriété et la valeur.


* Déclaration des sélecteurs CSS : d'élément (de type), d'identifiant (`#id`), de classe (`.class`), de groupe et universel (`*`).


* Application des propriétés de mise en forme pour le texte, la bordure et l'arrière-plan.




* **Ateliers d'implémentation :**
* Application de styles en ligne (inline) sur des éléments de la page.


* Application de styles internes (head) sur des éléments d'une page web.


* Formatage et commentaire systématique des blocs de règles CSS.


* **Synthèse :** Fiche récapitulative visuelle associant chaque propriété de mise en forme à son effet graphique.
* **Évaluation :** Détection d'erreurs de syntaxe dans une feuille de style et exercice pratique de reproduction d'une maquette web stricte.

### Chapitre 2 : Positionnement, Transformations et Animations

* **Situation de départ :** Dynamiser la navigation du portail web avec des effets au survol pour guider visuellement l'utilisateur.
* **Acquisition des savoirs :**
* Positionner et dimensionner un élément.


* Ajouter un effet de transformation à un élément (`rotate()`, `skew()`, `scale()`, `translate()`).


* Créer des animations CSS3 à l'aide de la règle `@keyframes` et ajouter un effet de transition à un élément.




* **Ateliers d'implémentation :**
* Intégration d'un menu de navigation interactif basé uniquement sur les transformations CSS3.
* Indentation des propriétés d'animation.


* **Synthèse :** Tableau comparatif illustré des super-propriétés `transition` et `animation`.


* **Évaluation :** Résolution d'un problème type baccalauréat nécessitant l'utilisation du sélecteur d'état (`:hover`) combiné à une transition.



---

## Module 3 : Interactivité Côté Client avec JavaScript (JS)

### Chapitre 1 : Fondamentaux, Variables et Structures de Contrôle

* **Situation de départ :** Création d'un simulateur interactif permettant aux élèves de calculer leur moyenne finale et d'estimer leur mention.
* **Acquisition des savoirs :**
* Déclaration de constantes (`const`) et de variables de manière implicite et/ou explicite (`let`), en distinguant leur portée locale et globale.


* Manipulation des types de données : `string`, `number`, `boolean`, `array` et `date`.


* Utilisation des structures de contrôle conditionnelles (`if`, `else`, `else if` et `switch`) et itératives (`for`, `while` et `do...while`).




* **Ateliers d'implémentation :**
* Développement de l'algorithme de calcul de la moyenne dans un fichier externe et appel depuis la page web.


* L'élève doit formater ses blocs de contrôle de manière lisible et commenter chaque étape logique.




* **Synthèse :** Schématisation sous forme d'organigramme des algorithmes de contrôle mis en place.
* **Évaluation :**
* Détection d'anomalies logiques dans l'implémentation d'une structure de données (ex: identifier une erreur où un élément non trié est faussement verrouillé ou marqué comme trié dans une illustration de tableau).
* Modification d'un code de programmation existant pour changer le comportement du simulateur.





### Chapitre 2 : Manipulation du DOM et Événements

* **Situation de départ :** Vérifier de manière instantanée que le mot de passe saisi lors de la création d'un compte respecte les normes de sécurité du lycée.
* **Acquisition des savoirs :**
* Accès à un élément d'un formulaire via son identifiant avec `getElementById` et via son nom avec `getElementsByName`.


* Manipulation des actions élémentaires simples : Entrées (`prompt`) et sorties (`innerHTML`, `write`, `alert`).


* Modification du contenu, des attributs et des styles des éléments d'une page.




* **Ateliers d'implémentation :**
* Le contrôle d'un champ d'un formulaire doit être effectué en JS sans utiliser l'attribut Pattern HTML5.




* **Synthèse :** Carte mentale listant les principales méthodes de sélection des éléments HTML et de modification du DOM.


* **Évaluation :** Problème de synthèse ciblant la validation de formulaire en JavaScript pour le baccalauréat.

---

## Module 4 : Conception et Gestion des Bases de Données (BDR)

### Chapitre 1 : Modélisation et Langage de Définition des Données (LDD)

* **Situation de départ :** La scolarité du lycée a besoin d'un système robuste informatisé pour gérer les dossiers des bacheliers, leurs classes et leurs options.
* **Acquisition des savoirs :**
* Définition des notions : table, relation (un à un, un à plusieurs, plusieurs à plusieurs), enregistrement, champ, clé primaire et clé étrangère.


* Distinction des contraintes d'intégrité de table, de domaine et référentielle.


* Représentation textuelle et graphique d'une BDR : clé primaire soulignée, et clé étrangère suivie du symbole #.




* **Ateliers d'implémentation :**
* Utilisation de requêtes pour créer une BDR et des tables, et modifier la structure d'une table (colonne et contrainte).


* Application rigoureuse de l'indentation sur les requêtes SQL (alignement des mots-clés de commande) et ajout de commentaires.


* **Synthèse :** Schéma global des contraintes d'intégrité définies sur le standard SQL.


* **Évaluation :**
* Évaluer une représentation (textuelle/graphique) d'une BDR, et corriger la représentation si elle est erronée.





### Chapitre 2 : Langage de Manipulation et d'Interrogation des Données

* **Situation de départ :** Extraire la liste nominative des lauréats et mettre à jour leurs dossiers dans le système informatisé.
* **Acquisition des savoirs :**
* Manipulation en mode SQL avec des requêtes pour insérer, supprimer et mettre à jour des lignes/colonnes (`INSERT`, `DELETE`, `UPDATE`).


* Exploitation de requêtes mono-table, avec jointures, imbriquées, et utilisant des fonctions agrégats (`AVG`, `COUNT`, `MAX`, `MIN`, `SUM`) et des groupements.




* **Ateliers d'implémentation :**
* Rédaction de scripts d'interrogation multicritères, obligeant l'élève à indenter clairement les clauses `SELECT`, `FROM`, et `WHERE`.


* **Synthèse :** Fiche récapitulative illustrant la structure générale d'une requête `SELECT` complexe.


* **Évaluation :** QCM sur le standard SQL et écriture de requêtes complexes avec sous-requêtes non corrélées dans la clause WHERE.



---

## Module 5 : Développement Dynamique avec PHP

### Chapitre 1 : Serveur, Syntaxe et Transmission de Données

* **Situation de départ :** Rendre l'espace intranet du lycée dynamique afin de permettre aux élèves de consulter leurs relevés de notes personnalisés.
* **Acquisition des savoirs :**
* Identification de la structure de base d'un script PHP et manipulation des variables : entier, réel, booléen, chaîne de caractères, tableau indicé et tableau associatif.


* Utilisation des structures de contrôle conditionnelles (`if`) et itératives (`for`, `while` et `do...while`).


* Définition et utilisation des variables superglobales `$_GET` et `$_POST` pour transmettre des données via une URL ou un formulaire.




* **Ateliers d'implémentation :**
* Récupération de données saisies dans un formulaire HTML via le protocole HTTP et la méthode `POST`.


* L'apprenant doit indenter correctement les balises PHP au sein de la page web et justifier ses traitements par des commentaires.




* **Synthèse :** Carte schématisant le cycle de vie d'une requête HTTP (Client -> Serveur Web -> Retour HTML).
* **Évaluation :** Détection d'anomalies liées à la portée et au transfert de variables entre multiples pages.

### Chapitre 2 : Interaction avec une Base de Données MySQL

* **Situation de départ :** Intégrer les données du serveur de la scolarité sur le portail web pour y afficher en temps réel les résultats des examens.
* **Acquisition des savoirs :**
* Se connecter à un serveur de base de données, sélectionner une base de données en exploitant les fonctions de l'extension MySQLi (`mysqli_connect`).


* Écrire et exécuter des requêtes SQL pour interroger et mettre à jour les données (`SELECT`, `INSERT`, `DELETE`, et `UPDATE`) à l'aide de `mysqli_query`.


* Exploiter les résultats d'une requête SQL pour les intégrer dans une page web.




* **Ateliers d'implémentation :**
* Création d'un tableau de bord de résultats en PHP/MySQL, en s'assurant d'appliquer les bonnes pratiques de programmation et de fermeture des connexions (`mysqli_close`).




* **Synthèse :** Fiche mémorielle présentant les fonctions indispensables de l'interface procédurale MySQLi.


* **Évaluation :** Problème de synthèse transversal (épreuve du baccalauréat) intégrant HTML5, CSS3, JS, SQL et PHP : Développer une application d'authentification et d'affichage de données sécurisée.