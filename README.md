# Tekki 🔧
> La plateforme qui connecte clients et techniciens à Douala

---

## Cahier des charges

| Rubrique | Détail |
|---|---|
| **Titre du projet** | **Tekki** — La plateforme qui connecte clients et techniciens à Douala |
| **Le problème** | Trouver un électricien, un plombier ou un réparateur fiable à Douala repose entièrement sur le bouche-à-oreille. Un habitant dont la climatisation tombe en panne un vendredi soir doit appeler cinq personnes avant de trouver quelqu'un de disponible — sans garantie de sérieux. Aucune app locale ne centralise ces profils avec avis et contacts vérifiés. |
| **Cible (utilisateurs)** | **Clients :** habitants de Douala ayant un besoin ponctuel de dépannage ou réparation à domicile. **Techniciens :** électriciens, plombiers, réparateurs télé/PC/téléphone, techniciens climatisation, menuisiers cherchant à développer leur clientèle. |
| **Proposition de valeur** | Tekki permet de trouver en moins de 2 minutes un technicien disponible dans son quartier, consulter ses avis clients, et le contacter directement sur WhatsApp — sans intermédiaire, sans commission. |
| **Fonctionnalités MVP** | 1. Recherche de techniciens par spécialité et par quartier. 2. Profil technicien (photo, nom, spécialité, quartier, tarif indicatif, note moyenne). 3. Contact direct WhatsApp en un clic depuis le profil. 4. Système d'avis et de notes clients (1 à 5 étoiles + commentaire). 5. Formulaire d'inscription pour les techniciens. |
| **Fonctionnalités bonus** | Géolocalisation automatique pour suggérer les techniciens les plus proches. Notifications de disponibilité. Prise de rendez-vous depuis l'app. Sauvegarde de techniciens en favoris. |
| **Écrans / pages** | 1. Accueil (barre de recherche + catégories de spécialités). 2. Liste des techniciens (résultats filtrés). 3. Profil technicien (détail + bouton WhatsApp + avis). 4. Formulaire d'inscription technicien. 5. Formulaire d'avis client. 6. Page connexion / inscription (Auth). |
| **Données manipulées** | **Technicien :** id, nom, photo (URL), spécialité, quartier, téléphone, tarif (FCFA), disponible (boolean), note_moyenne, nb_avis, date_inscription. **Avis :** id, technicien_id, auteur_nom, note (1-5), commentaire, date. **Utilisateur :** uid, nom, email, rôle (client ou technicien). |
| **Stack technique** | Angular 21+ (standalone components) — TailwindCSS (styles) — Firebase Auth (authentification) — Cloud Firestore (base de données) — Firebase Storage (photos de profil) — Firebase Hosting (déploiement). |
| **Contrainte connexion** | Les profils récemment consultés sont mis en cache localStorage pour un accès hors ligne. Les données textuelles (nom, quartier, téléphone) sont chargées en priorité avant les images. La persistance hors ligne Firestore est activée (`enableIndexedDbPersistence`). Les photos sont compressées avant upload. |

---

## Branches Git

| Branche | Rôle |
|---|---|
| `main` | Version stable — ne pas modifier directement |
| `apprenant` | Branche de travail quotidienne |
| `formateur` | Réservée aux retours du formateur |

---

> *« Visez petit mais fini. Une app simple qui marche vaut mieux qu'une grande idée jamais terminée. »*
> — Angular Talent Lab 2026
