# Flowdar
> Détecte, alerte et guide — la plateforme citoyenne contre les inondations à Douala

---

## Cahier des charges

| Rubrique | Détail |
|---|---|
| **Titre du projet** | **Flowdar** — Détection automatique des risques d'inondation et guidage citoyen à Douala en temps réel |
| **Le problème** | Près de 48% de la ville de Douala est exposée aux risques d'inondation. Entre 2024 et 2025, plus d'un million de Camerounais ont été affectés. Quand il pleut fort, personne ne sait en temps réel quelles rues sont praticables : les gens partent travailler, se retrouvent bloqués dans 80cm d'eau, parfois en danger. Les prévisions officielles de l'ONACC sont régionales et décadaires (tous les 10 jours) — elles ne disent pas si la rue Joss est sous l'eau ce matin. Les groupes WhatsApp et Facebook informent, mais trop tard, sans géolocalisation ni structure. |
| **Cible (utilisateurs)** | Résidents de Douala qui se déplacent pendant ou après une forte pluie : conducteurs, piétons, commerçants, parents d'élèves, livreurs. |
| **Proposition de valeur** | Flowdar détecte automatiquement les risques d'inondation via la météo, les citoyens confirment sur le terrain, et l'app suggère en temps réel les itinéraires sûrs pour éviter les zones à risque. |
| **Fonctionnalités MVP** | 1. Détection automatique des risques via OpenWeatherMap (pluies intenses → alerte générée sur les zones historiquement inondables de Douala). 2. Carte interactive Google Maps des alertes actives avec niveau de risque (léger / moyen / dangereux). 3. Confirmation citoyenne d'une alerte existante ("c'est encore là") ou signalement manuel d'une nouvelle zone. 4. Suggestion d'itinéraire sûr : l'app affiche un chemin qui évite les zones alertées. 5. Badge "résolu" automatique après 3h sans confirmation, ou clôture manuelle par un citoyen. |
| **Fonctionnalités bonus** | Historique des quartiers les plus touchés (carte de chaleur). Notifications push lors d'une alerte dans son quartier. Filtre par quartier pour ne voir que sa zone. Photo jointe à un signalement citoyen. |
| **Écrans / pages** | 1. Accueil — carte Google Maps avec alertes actives en temps réel. 2. Détail alerte — niveau, heure, nombre de confirmations, bouton "Confirmer / Résolu". 3. Signalement manuel — formulaire (quartier, niveau, description). 4. Itinéraire sûr — saisie destination, affichage du chemin évitant les zones alertées. 5. Historique — liste des alertes passées par quartier. 6. Connexion / Inscription — Firebase Auth. |
| **Données manipulées** | **Alerte :** id, source (auto / citoyen), quartier, coordonnées GPS (lat/lng), niveau (léger / moyen / dangereux), heure_debut, nb_confirmations, statut (actif / résolu), photo_url (optionnel). **Utilisateur :** uid, nom, email, quartier_domicile. **Zone à risque :** id, nom_quartier, coordonnées_polygone, historique_inondations (boolean). |
| **Stack technique** | Angular 21+ (standalone components) — TailwindCSS (styles) — Firebase Auth (authentification) — Cloud Firestore (alertes temps réel) — Firebase Storage (photos signalements) — Firebase Hosting (déploiement) — OpenWeatherMap API (détection météo automatique) — Google Maps JavaScript API (carte interactive + itinéraires). |
| **Contrainte connexion** | Les dernières alertes actives sont mises en cache localStorage pour consultation hors ligne. Les nouveaux signalements citoyens sont mis en file d'attente et envoyés à la reconnexion (Firestore offline persistence activée). L'app reste consultable sans connexion avec les données de la dernière session. Les données textuelles sont prioritaires sur les images. |

---

> *« Visez petit mais fini. Une app simple qui marche vaut mieux qu'une grande idée jamais terminée. »*
> — Angular Talent Lab 2026
