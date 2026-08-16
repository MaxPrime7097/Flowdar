**FLOWDAR**

*Specifications Frontend Angular 21+ — v4*

Nlend Max — Angular Talent Lab 2026 — Orange Digital Center Douala

|*v4 — Corrections UX majeures : distinction source alerte, systeme de statuts visuels, validation croisee resolution, affichage score, separation score vs signalements.*|
| :- |

# **1. Stack technique**

|**Couche**|**Technologie**|**Usage**|
| :- | :- | :- |
|Framework|Angular 21+ (standalone components)|Structure, routing, services, formulaires reactifs|
|Styles|TailwindCSS|UI responsive mobile-first|
|Carte|Google Maps JavaScript API|Carte + marqueurs avec statut visuel clair|
|Itineraires|Google Maps Directions API|Itineraire evitant les zones alertees|
|Autocomplete|Google Maps Places API|Champ destination (Ecran 5)|
|Temps reel|Supabase Realtime|Alertes et scores mis a jour sans rechargement|
|Auth|Supabase Auth|Email/password + Google Sign-In|
|Fichiers|Supabase Storage|Photos signalement (1 Go gratuit)|
|HTTP|Angular HttpClient|Appels vers API REST backend Mr Ebanga Arnaud|
|Offline|localStorage + Supabase cache|Consultation hors connexion|
|Deploiement|Vercel|Mise en ligne gratuite, integration GitHub native|

|*Supabase remplace Firebase : meme fonctionnalites (Auth, Realtime, Storage), 100% gratuit incluant le Storage, et PostgreSQL coherent avec le backend de Mr Ebanga Arnaud.*|
| :- |

|<p>npm install @supabase/supabase-js   # Supabase (Auth + Realtime + Storage)</p><p>npm install @angular/google-maps    # Google Maps natif Angular</p>|
| :- |

# **2. Systeme visuel unifie des alertes — v4**

|*Section ajoutee en v4 suite aux retours UX. Chaque alerte doit afficher 4 informations distinctes et immediatement lisibles : source, statut, niveau de risque, signalements citoyens.*|
| :- |

## **2.1 Source de l'alerte (2 sources uniquement)**
Le bulletin ONACC est integre dans la detection automatique — l'utilisateur n'a pas besoin de connaitre la difference. Seulement 2 sources visibles :

|**Source**|**Icone**|**Label affiche**|**Couleur du badge**|
| :- | :- | :- | :- |
|Detection automatique (meteo + ONACC fusionne)|Satellite|Detecte automatiquement|Bleu #2257B3|
|Signalement citoyen|Personne|Signale par la communaute|Violet #7C3AED|

## **2.2 Statut de l'alerte (3 statuts visuellement distincts)**

|**Statut**|**Badge**|**Couleur**|**Comportement visuel**|**Carte**|
| :- | :- | :- | :- | :- |
|Preventive|Horloge + 'A venir · 17h00'|Bleu clair #DBEAFE|Compte a rebours anime|Bordure bleue pointillee|
|Active|Point rouge + 'En cours · depuis 2h'|Rouge #FEE2E2|Point qui pulse en continu|Bordure rouge solide + ombre|
|En resolution|Sablier + '1/3 resolutions'|Orange #FFEDD5|Statique|Bordure orange|
|Resolue|Coche + 'Degagee · il y a 30min'|Gris #F1F5F9|Aucun|Carte grisee, opacite 50%|

## **2.3 Niveau de risque — score toujours contextualise**
Le score ne s'affiche JAMAIS seul. Toujours accompagne d'un label et d'une jauge :

|<p>// Affichage correct :</p><p>Risque eleve                     <- label texte</p><p>[████████████░░░░]  87 / 100     <- jauge + chiffre / 100</p><p></p><p>// NE JAMAIS afficher :</p><p>87                               <- ambigue (signalements ? score ?)</p>|
| :- |

|**Score**|**Label**|**Couleur jauge**|**Couleur badge**|
| :- | :- | :- | :- |
|< 30|Aucun risque|Gris|Gris|
|30 a 59|Risque leger|Jaune #EAB308|Fond jaune clair|
|60 a 84|Risque moyen|Orange #FF9933|Fond orange clair|
|85 a 100|Risque eleve|Rouge #EF4444|Fond rouge clair|

|*Correction v4 (retour UX) : les bornes utilisent la notation [inclus, exclus) : score >= 85 = danger, 60 <= score < 85 = moyen, 30 <= score < 60 = leger, score < 30 = aucun.*|
| :- |

## **2.4 Separation score vs signalements citoyens**
Ces deux metriques sont toujours affichees separement avec leurs labels propres. Jamais sur la meme ligne sans distinction :

|<p>┌─────────────────────────────────────────┐</p><p>│  Ndokotti · En cours · depuis 2h        │</p><p>│  [Detecte automatiquement]              │</p><p>│                                         │</p><p>│  Risque eleve                           │</p><p>│  [████████████░░]  87 / 100             │</p><p>│                                         │</p><p>│  👥 14 citoyens confirment              │</p><p>└─────────────────────────────────────────┘</p><p></p><p>Jamais :</p><p>│  87  ·  14 signalements                 │  <- INTERDIT</p>|
| :- |

## **2.5 Systeme de resolution — validation croisee**
Un citoyen seul ne peut pas resoudre une alerte. La resolution necessite une validation croisee :

|<p>Citoyen tape 'C'est passe'</p><p>`        `|</p><p>`        `v</p><p>Statut -> EN RESOLUTION (pas encore resolue)</p><p>Badge : 'Signale degagee · 1/3 confirmations'</p><p>`        `|</p><p>`        `|-- 2 autres citoyens confirment en < 30min</p><p>`        `|   -> Statut = RESOLUE</p><p>`        `|</p><p>`        `|-- Score meteo redescend < 30</p><p>`        `|   -> Statut = RESOLUE automatiquement</p><p>`        `|</p><p>`        `'-- 30min sans autres confirmations</p><p>`            `-> Retour statut ACTIVE</p><p>`            `-> Badge : 'Signalement de resolution non confirme'</p>|
| :- |

|*La resolution n'est jamais immediate. Elle necessite 3 confirmations citoyennes en moins de 30 minutes OU un score meteorologique < 30. Cela evite les faux positifs et renforce la credibilite.*|
| :- |

# **3. Structure des dossiers**

|<p>src/app/</p><p>├── core/</p><p>│   ├── services/</p><p>│   │   ├── alerte.service.ts</p><p>│   │   ├── score.service.ts</p><p>│   │   ├── auth.service.ts</p><p>│   │   ├── maps.service.ts</p><p>│   │   └── weather.service.ts</p><p>│   └── guards/</p><p>│       ├── auth.guard.ts</p><p>│       └── no-auth.guard.ts</p><p>│</p><p>├── features/</p><p>│   ├── carte/</p><p>│   │   ├── carte.component.ts</p><p>│   │   ├── carte-marqueur.component.ts    → Marqueur avec badge source + statut + jauge</p><p>│   │   └── carte-bottomsheet.component.ts → Popup avec les 4 infos distinctes</p><p>│   ├── alerte-detail/</p><p>│   │   ├── alerte-detail.component.ts</p><p>│   │   ├── score-breakdown.component.ts   → Jauge + label + decomposition 4 facteurs</p><p>│   │   ├── resolution-tracker.component.ts → 'X/3 confirmations resolution'</p><p>│   │   └── confirmation-list.component.ts</p><p>│   ├── alertes-preventives/</p><p>│   │   └── alertes-preventives.component.ts</p><p>│   ├── signalement/</p><p>│   │   ├── signalement.component.ts</p><p>│   │   ├── step-zone.component.ts</p><p>│   │   ├── step-details.component.ts</p><p>│   │   └── step-recap.component.ts</p><p>│   ├── itineraire/</p><p>│   │   ├── itineraire.component.ts</p><p>│   │   └── itineraire-carte.component.ts</p><p>│   ├── historique/</p><p>│   │   └── historique.component.ts</p><p>│   └── auth/</p><p>│       ├── auth.component.ts</p><p>│       ├── login.component.ts</p><p>│       └── register.component.ts</p><p>│</p><p>└── shared/</p><p>`    `├── components/</p><p>`    `│   ├── navbar/</p><p>`    `│   ├── alerte-card/             → Affiche les 4 blocs distincts</p><p>`    `│   ├── source-badge/            → Badge source (auto / citoyen) — NOUVEAU v4</p><p>`    `│   ├── statut-badge/            → Badge statut (preventive/active/resolution/resolue)</p><p>`    `│   ├── risk-gauge/              → Jauge + label + score/100 — NOUVEAU v4</p><p>`    `│   ├── citizen-count/           → '👥 X citoyens confirment' — NOUVEAU v4</p><p>`    `│   └── meteo-bandeau/</p><p>`    `└── pipes/</p><p>`        `└── temps-ecoule.pipe.ts</p>|
| :- |

# **4. Routes et guards**

|**Route**|**Composant**|**Acces**|**Guard**|
| :- | :- | :- | :- |
|/|CarteComponent|Tout le monde|Aucun|
|/alerte/:id|AlerteDetailComponent|Tout le monde|Aucun|
|/preventives|AlertesPreventivesComponent|Tout le monde|Aucun|
|/itineraire|ItineraireComponent|Tout le monde|Aucun|
|/historique|HistoriqueComponent|Tout le monde|Aucun|
|/signaler|SignalementComponent|Connecte uniquement|AuthGuard|
|/auth|AuthComponent|Non connecte uniquement|NoAuthGuard|

# **5. Detail des 7 ecrans — v4**
## **Ecran 1 — Carte principale**

|*Chaque marqueur affiche desormais 3 informations visuelles distinctes : couleur du niveau, icone de source, animation de statut.*|
| :- |

- Carte Google Maps plein ecran
- Marqueurs avec 3 couches visuelles : couleur niveau (rouge/orange/jaune) + icone source (satellite/personne) + animation statut (pulse si active, statique si preventive, grise si resolue)
- Jauge de risque visible directement sur le marqueur en hover
- Bandeau meteo : pluie actuelle en mm/h pour le quartier le plus proche
- Bouton flottant 'Signaler une zone' (connecte uniquement)
- Bottom navigation : Carte / Preventives / Itineraire / Historique / Profil
- Mise a jour temps reel via Supabase Realtime
- Clic marqueur -> bottom sheet avec les 4 blocs distincts (source, statut, risque, citoyens)

## **Ecran 2 — Detail d'une alerte**

|*C'est l'ecran qui applique le plus de corrections v4. Les 4 informations sont toutes distinctes et dans des blocs separes.*|
| :- |

**Bloc 1 — En-tete**

- Nom du quartier en grand
- Badge source : [Satellite] 'Detecte automatiquement' (bleu) OU [Personne] 'Signale par la communaute' (violet)

**Bloc 2 — Statut (toujours visible en haut a droite)**

- PREVENTIVE : badge bleu clair + horloge + 'A venir · dans 2h30'
- ACTIVE : badge rouge + point qui pulse + 'En cours · depuis 2h'
- EN RESOLUTION : badge orange + 'Signale degagee · 1/3 confirmations'
- RESOLUE : badge gris + coche + 'Degagee · il y a 30min'

**Bloc 3 — Niveau de risque**

- Label texte : 'Risque eleve' / 'Risque moyen' / 'Risque leger'
- Jauge horizontale coloree (composant risk-gauge)
- Score affiche : '87 / 100' — JAMAIS le chiffre seul
- Decomposition optionnelle (bouton 'Voir le detail') : Meteo X/40 + Historique X/30 + Citoyens X/20 + Geographie X/10

**Bloc 4 — Signalements citoyens**

- '👥 14 citoyens confirment' — clairement separe du score
- Timeline des confirmations avec horodatage

**Actions**

- Bouton 'Confirmer — c'est encore la' (connecte, statut active uniquement)
- Bouton 'C'est passe' (connecte, statut active uniquement) — declenche le systeme de validation croisee
- Si non connecte : 'Connectez-vous pour confirmer'

## **Ecran 3 — Alertes preventives**
- Bandeau previsions meteo heure par heure
- Chaque carte affiche clairement : badge PREVENTIVE bleu + heure prevue + score previsionnel + jauge
- Note sous chaque carte : 'Deviendra active si le score depasse 85 a l'heure prevue'

## **Ecran 4 — Signalement citoyen (3 etapes)**
- Etape 1 : quartier connu (liste) OU 'Zone non repertoriee + GPS' + selecteur niveau
- Etape 2 : description + photo optionnelle (Supabase Storage)
- Etape 3 : recap + message 'Votre signalement sera visible apres 2 confirmations d'autres citoyens'

## **Ecran 5 — Itineraire sur**
- Destination (autocomplete Google Places) + depart = position actuelle
- Carte avec itineraire bleu + zones alertees colorees selon leur niveau
- Bandeau : 'Itineraire modifie — evite Ndokotti (Risque eleve · 87/100) et Bepanda (Risque moyen · 64/100)'
- Badge source visible sur chaque zone evitee

## **Ecran 6 — Historique**
- Filtre par quartier + filtre par source (auto / citoyen)
- Chaque alerte passee affiche : date, duree, score, source, nb confirmations
- Stat : 'Ndokotti — 12 alertes ce mois, score moyen : 74/100'

## **Ecran 7 — Connexion / Inscription**
- Logo Flowdar, toggle Login/Inscription
- Email + mot de passe + Google Sign-In (Supabase Auth)
- Quartier de domicile (inscription uniquement)

# **6. Composants shared — Detail v4**
## **source-badge.component (NOUVEAU)**

|<p>// Inputs :</p><p>@Input() source: 'auto' | 'citoyen'</p><p></p><p>// Rendu :</p><p>source = 'auto'    -> [Satellite] 'Detecte automatiquement'  (bleu)</p><p>source = 'citoyen' -> [Personne]  'Signale par la communaute' (violet)</p>|
| :- |

## **statut-badge.component**

|<p>// Inputs :</p><p>@Input() statut: 'preventive' | 'active' | 'en\_resolution' | 'resolue'</p><p>@Input() heure\_prevue?: Date    // pour preventive</p><p>@Input() depuis?: Date          // pour active</p><p>@Input() nb\_resolutions?: number // pour en\_resolution</p><p></p><p>// Rendu selon statut :</p><p>preventive    -> badge bleu  + horloge + compte a rebours</p><p>active        -> badge rouge + point pulse + temps ecoule</p><p>en\_resolution -> badge orange + 'X/3 confirmations degagement'</p><p>resolue       -> badge gris  + coche + 'Degagee · il y a Xmin'</p>|
| :- |

## **risk-gauge.component (NOUVEAU)**

|<p>// Inputs :</p><p>@Input() score: number  // 0-100</p><p></p><p>// Rendu :</p><p>score < 30  -> label 'Aucun risque'  + jauge grise</p><p>score < 60  -> label 'Risque leger'  + jauge jaune</p><p>score < 85  -> label 'Risque moyen'  + jauge orange</p><p>score >= 85 -> label 'Risque eleve'  + jauge rouge</p><p></p><p>// Template :</p><p><span class='risk-label'>{{ getRiskLabel(score) }}</span></p><p><div class='gauge-bar'></p><p>`  `<div class='gauge-fill' [style.width.%]='score' [class]='getRiskClass(score)'></div></p><p></div></p><p><span class='score-display'>{{ score }} / 100</span></p>|
| :- |

## **citizen-count.component (NOUVEAU)**

|<p>// Inputs :</p><p>@Input() count: number</p><p>@Input() type: 'confirmation' | 'resolution'</p><p></p><p>// Rendu :</p><p>type = 'confirmation' -> '👥 14 citoyens confirment'</p><p>type = 'resolution'   -> '🏳️ 2 citoyens signalent que c'est passe'</p>|
| :- |

# **7. Services Angular**
## **alerte.service.ts**

|<p>getAlertesActives()          // Supabase Realtime — temps reel</p><p>getAlerteById(id)            // GET /api/alertes/:id</p><p>getAlertesPreventives()      // GET /api/alertes?type=preventive</p><p>getHistorique(quartier)      // GET /api/alertes/historique/:quartier</p><p>confirmerAlerte(id)          // POST /api/alertes/:id/confirmer</p><p>signalerResolution(id)       // POST /api/alertes/:id/resoudre</p><p>`                             `// -> Statut : active -> en\_resolution</p><p>`                             `// -> Resolution effective apres 3 confirmations</p><p>signalerZone(signalement)    // POST /api/alertes/signaler</p>|
| :- |

# **8. Communication avec le backend**

|**Endpoint**|**Methode**|**Utilise dans**|**Notes v4**|
| :- | :- | :- | :- |
|/api/alertes|GET|Carte (Ecran 1)|Retourne source, statut, score, nb\_confirmations, nb\_resolutions|
|/api/alertes/:id|GET|Ecran 2|Retourne score\_detail + liste confirmations + liste resolutions|
|/api/alertes/:id/confirmer|POST|Ecran 2|nb\_confirmations +1|
|/api/alertes/:id/resoudre|POST|Ecran 2|nb\_resolutions +1 ; resolution effective si nb\_resolutions >= 3|
|/api/alertes/signaler|POST|Ecran 4|visible=false jusqu'a 2 confirmations|
|/api/scores|GET|score.service|Score + niveau + source par zone|
|/api/itineraire|POST|Ecran 5|Zones actives a eviter avec score et source|
|/api/meteo/previsions|GET|Ecran 3|Score previsionnel + heure par zone|

|*Nouveau champ requis du backend en v4 : nb\_resolutions (nombre de signalements 'C'est passe' recus). Le backend gere la logique de validation croisee (3 resolutions = alerte resolue). Angular affiche juste le compteur.*|
| :- |

# **9. Comportements hors connexion**

|**Situation**|**Comportement**|
| :- | :- |
|Pas de reseau|Alertes cache localStorage + bandeau 'Donnees hors ligne — HH:MM' + statuts geles|
|Reseau coupe|Supabase offline cache automatique|
|Signalement sans reseau|File d'attente, envoye a la reconnexion|
|Confirmation sans reseau|File d'attente, envoyee a la reconnexion avec timestamp original|
|Retour en ligne|Supabase resync auto, statuts mis a jour|

# **10. Checklist de livraison frontend v4**
1. Angular 21+ initialise (ng new flowdar --standalone)
1. TailwindCSS configure
1. Supabase configure (Auth + Realtime + Storage)
1. Google Maps integre (@angular/google-maps) avec restriction HTTP referrer
1. 7 routes et 2 guards configures
1. source-badge.component : 2 sources visuellement distinctes (auto=bleu, citoyen=violet)
1. statut-badge.component : 4 statuts visuellement distincts avec animations appropriees
1. risk-gauge.component : jauge + label + score/100 — jamais le chiffre seul
1. citizen-count.component : signalements toujours separes du score
1. resolution-tracker.component : compteur 'X/3 confirmations degagement'
1. alerte-card affiche les 4 blocs separes (source, statut, risque, citoyens)
1. Ecran detail : bouton 'C'est passe' declenche en\_resolution — pas resolution immediate
1. Comportement offline teste
1. Deploiement Vercel operationnel

*Flowdar v4 — Frontend — Nlend Max — ATL 2026 — Orange Digital Center Douala*
