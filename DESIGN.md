# DESIGN.md — Flowdar
> Fichier de référence design à donner à Claude Code avant tout travail UI.
> Flowdar = plateforme citoyenne de détection d'inondations à Douala.
> Ambiance : **outil d'urgence professionnel** — pas une startup app sympa, pas un dashboard générique. Pense application de sécurité civile moderne, sobre, lisible en plein soleil sur un écran de téléphone mouillé.

---

## 1. Références visuelles

L'app doit évoquer ces directions :
- **Linear** — typographie serrée, densité d'information propre, pas de fioriture
- **Waze** — carte en fond, information d'urgence lisible d'un coup d'œil
- **Citizen App** — hiérarchie claire entre alerte critique et alerte mineure
- **GOV.UK Design System** — sobriété totale, accessibilité prioritaire, confiance

Ce qu'on veut ÉVITER absolument :
- Fond crème + accent terracotta (look "startup 2023")
- Fond noir + néon (look "crypto/dark mode générique")
- Cards avec trop d'ombres et de gradients (look "material design daté")
- Illustrations ou emojis dans l'UI (trop léger pour un outil d'urgence)

---

## 2. Palette de couleurs

```css
/* tokens à définir dans tailwind.config.js */

--color-primary:        #2257B3;  /* Bleu confiance — actions principales, liens, navigation */
--color-primary-hover:  #3D8CC2;  /* Bleu clair — survol/pression des éléments primaires */
--color-primary-light:  #DBEAFE;  /* Bleu pale — fonds info, badges neutres */

--color-accent:         #FF9933;  /* Orange marque — FAB et CTA de mise en avant UNIQUEMENT.
                                      Jamais pour un niveau de risque (voir règle d'or ci-dessous) */
--color-accent-light:   #FFE8CC;  /* Orange pale — fond derrière un élément accent */

--color-danger:         #DC2626;  /* Rouge — score > 85, alerte dangereuse */
--color-danger-light:   #FEE2E2;  /* Rouge pale — fond badge danger */

--color-warning:        #D97706;  /* Orange — score 60-85, alerte moyenne */
--color-warning-light:  #FEF3C7;  /* Orange pale — fond badge moyen */

--color-caution:        #CA8A04;  /* Jaune foncé — score 30-60, alerte légère */
--color-caution-light:  #FEF9C3;  /* Jaune pale — fond badge léger */

--color-success:        #16A34A;  /* Vert — itinéraire praticable, résolu */
--color-success-light:  #DCFCE7;  /* Vert pale — fond badge résolu */

--color-surface:        #FFFFFF;  /* Fond cards et écrans */
--color-background:     #F7F9FC;  /* Fond général de l'app */
--color-border:         #E2E8F0;  /* Bordures, séparateurs */

--color-text-primary:   #0F172A;  /* Texte principal — quasi noir */
--color-text-secondary: #64748B;  /* Texte secondaire — gris moyen */
--color-text-muted:     #94A3B8;  /* Texte désactivé, placeholders */
```

**Règle d'or :** les 4 couleurs d'alerte (danger/warning/caution/success) ne servent QU'à indiquer un niveau de risque. Jamais pour décorer. Ça inclut l'Accent (#FF9933) : bien qu'orange comme le warning, il ne doit **jamais** apparaître sur un badge, marqueur ou score — uniquement sur des CTA hors risque (FAB, boutons de mise en avant).

---

## 3. Typographie

```css
/* Deux polices uniquement — pas de Roboto partout */

--font-display: 'Exo 2', sans-serif;
/* Titres, scores numériques, noms de quartiers
   Caractère : géométrique, technique, lisible en gras
   Import : https://fonts.google.com/specimen/Exo+2 */

--font-body: 'Roboto', sans-serif;
/* Corps de texte, labels, boutons, formulaires
   Caractère : neutre, dense, haute lisibilité
   Import : https://fonts.google.com/specimen/Roboto */
```

**Échelle typographique :**
```
Score numérique (ex: "87")    → Exo 2, 48px, Bold, couleur selon niveau
Nom de quartier (titre écran) → Exo 2, 24px, SemiBold, #0F172A
Section header                → Exo 2, 18px, SemiBold, #0F172A
Body / description            → Roboto, 15px, Regular, #0F172A
Label / badge texte           → Roboto, 13px, Medium, selon couleur badge
Timestamp / muted info        → Roboto, 13px, Regular, #64748B
```

---

## 4. Spacing & Layout

```
Padding écran (horizontal) : 16px
Padding card intérieur     : 16px
Gap entre cards            : 12px
Border radius cards        : 12px
Border radius badges       : full (pill) — v2, voir note de réconciliation en bas de fichier
Border radius boutons      : 8px
Bottom nav height          : 64px
Top status bar clearance   : 44px (iPhone safe area)
```

**Règle de densité :** Flowdar est une app d'urgence consultée rapidement. Favorise la densité sur l'espace vide — les cartes doivent montrer le maximum d'info sans scroll inutile.

---

## 5. Composants signature

### Score Badge (composant central de l'app)
```
Affichage : chiffre large (48px Exo 2 Bold) + "/100" petit (16px)
Couleur du chiffre : selon niveau
  ≥ 85  → #DC2626 (danger)
  ≥ 60  → #D97706 (warning)
  ≥ 30  → #CA8A04 (caution)
  < 30  → #94A3B8 (muted — pas d'alerte)
Fond    : cercle ou pill avec couleur-light correspondante
Taille  : 64x64px sur la carte, 96x96px sur l'écran détail
```

### Marqueur carte
```
Forme    : cercle plein avec contour blanc 2px + ombre légère
Contenu  : score numérique en blanc, Exo 2 Bold 13px
Taille   : 40x40px
Couleurs : fond selon niveau (danger/warning/caution)
État hover/actif : scale(1.15) + ombre plus prononcée
```

### Alerte Card
```
Fond          : #FFFFFF
Border        : 1px solid #E2E8F0
Border-left   : 4px solid <couleur niveau> ← c'est l'élément signature
Border-radius : 12px
Ombre         : 0 1px 3px rgba(0,0,0,0.08)

Contenu :
  Ligne 1 : [Score Badge small] [Nom quartier, Exo 2 16px Bold] [Badge niveau]
  Ligne 2 : [Source] · [il y a Xh] · [nb confirmations]
  Ligne 3 (si active) : boutons Confirmer / C'est passé
```

### Barre de décomposition du score (Écran 2)
```
4 segments horizontaux colorés, proportionnels à leur contribution :
  Météo      : #2257B3  (bleu)
  Historique : #7C3AED  (violet)
  Citoyens   : #D97706  (orange)
  Géographie : #16A34A  (vert)
Hauteur : 8px, border-radius : 4px
Labels sous chaque segment : "Météo 32/40", "Historique 18/30"...
```

### Bottom Navigation
```
Fond         : #FFFFFF avec border-top 1px #E2E8F0
Hauteur      : 64px + safe area
5 onglets    : Carte / Préventives / Itinéraire / Historique / Profil
Icônes       : Lucide Icons, 22px
État actif   : icône + label #2257B3, fond pill #DBEAFE
État inactif : icône + label #94A3B8
```

### Boutons
```
Primaire  : fond #2257B3, survol/pression #3D8CC2, texte blanc, Roboto 15px Medium, hauteur 48px
Secondaire: fond #F1F5F9, texte #0F172A, même taille
Danger    : fond #DC2626, texte blanc (bouton "Signaler zone critique")
Disabled  : opacity 0.4, pas de cursor-pointer
FAB       : fond #FF9933 (accent), icône blanche, 56x56px, ombre medium, bottom-right
```

---

## 6. États et feedback

```
Loading    : skeleton screens (pas de spinner centré) — même layout que le contenu
Empty      : illustration minimaliste SVG + texte court + action suggérée
Error      : bandeau rouge discret en haut (pas de modal)
Success    : bandeau vert 3 secondes (toast), pas de page de confirmation
Hors ligne : bandeau bleu persistant en haut "Données hors ligne — HH:MM"
```

---

## 7. Règles d'accessibilité non négociables

- Contraste minimum 4.5:1 pour tout texte sur fond coloré
- Taille tactile minimum 44x44px pour tous les éléments interactifs
- Jamais de couleur seule pour transmettre une information (toujours texte + couleur)
- Les 4 niveaux d'alerte doivent être distinguables en vision daltonienne
  → Danger : rouge + texte "DANGEREUX" + icône triangle
  → Warning : orange + texte "MOYEN" + icône cercle
  → Caution : jaune + texte "LÉGER" + icône info

---

## 8. Prompt-type pour Claude Code

Colle ce bloc en tête de chaque demande UI à Claude Code :

```
Tu travailles sur Flowdar, une app Angular 21+ d'alertes d'inondation
pour Douala, Cameroun. Consulte DESIGN.md avant de coder quoi que ce soit.

Ambiance : outil d'urgence professionnel sobre (référence : Linear + Citizen App).
Pas de fond crème, pas de gradients décoratifs, pas d'illustrations.

Polices : Exo 2 (titres, scores) + Roboto (corps). Pas d'autre police.
Couleurs : utilise UNIQUEMENT les tokens de DESIGN.md.
Tailwind : classes utilitaires uniquement, pas de style inline.

Process obligatoire :
1. Décris d'abord ton plan de design en 5 lignes (layout, hiérarchie, couleur dominante)
2. Code ensuite en suivant ce plan
3. Prends un screenshot du résultat et critique-le toi-même avant de me le montrer

Composant à créer : [DÉCRIRE ICI]
```

---

## 9. Ce que Claude Code doit critiquer dans ses screenshots

Avant de te montrer un résultat, demande-lui explicitement de vérifier :
- [ ] Les couleurs d'alerte sont-elles uniquement sur les éléments de risque ?
- [ ] Le score numérique est-il lisible en 1 seconde à bout de bras ?
- [ ] Y a-t-il des gradients ou ombres décoratives inutiles ?
- [ ] La border-left colorée est-elle présente sur les cards ?
- [ ] Les boutons font-ils minimum 48px de hauteur ?
- [ ] La police Exo 2 est-elle utilisée pour les titres et scores ?

---

## 10. Note de réconciliation (v2 — 2026-07-27)

Max a généré 8 écrans avec Google Stitch (`stitch_flowdar_flood_detection_app/`), qui exporte aussi son propre
fichier de design auto-généré (`hydro_alert_framework/DESIGN.md`, style Material 3, ton "Hydro-Alert Framework").
Ce fichier-ci (le DESIGN.md original de Max) reste la référence unique pour Claude Code. Décisions de
réconciliation entre les deux documents :

| Sujet | Doc de Max (v1) | Doc auto Stitch | Decision v2 | Pourquoi |
|---|---|---|---|---|
| Typographie | DM Sans + Inter | Inter uniquement | **DM Sans + Inter conservé** | Choix deliberate de Max pour la hiérarchie titres/scores, déjà implémenté ; pas juste un défaut d'IA |
| Warning/Caution | #D97706 / #CA8A04 | #F97316 / #EAB308 (= couleurs du Cahier des Charges v3, non retravaillées) | **#D97706 / #CA8A04 conservé** | Meilleur contraste (règle section 7 : 4.5:1 minimum) — le doc Stitch reprend juste les couleurs brutes du CDC sans passe accessibilité |
| Ombre des cards | `0 1px 3px rgba(0,0,0,0.08)` | `0px 4px 12px rgba(30,41,59,0.08)` | **Ombre fine conservée** | Le doc de Max rejette explicitement en section 1 les "cards avec trop d'ombres" — l'ombre large de Stitch va à l'encontre de sa propre regle |
| Radius badges/status | 6px rounded-rect | Pill complet | **Pill complet adopté** | Les écrans Stitch réels rendent les badges en pill ; Max a validé ce changement (voir section 4, mis à jour) |
| Tokens Material additionnels (surface-dim, outline, etc.) | absent | présent (~30 tokens) | **Non adopté** | Le jeu de tokens simplifié de Max suffit au périmètre de l'app, pas besoin de la profondeur Material 3 |
| Bottom nav 4 icônes ("Accueil/Carte/Alertes/Profil") | 5 onglets (section 5) | mentionné dans le prose Stitch | **5 onglets conservé** | Les écrans Stitch réels utilisent aussi 5 onglets (Carte/Prévention/Itinéraire/Historique/Profil) — la mention à 4 dans le doc Stitch est un résidu non appliqué |

**Nouveautés repérées dans les écrans Stitch (hors périmètre de cette réconciliation, à traiter séparément) :**
barre de recherche sur la carte, toast de risque proactif, bandeau météo horaire sur l'écran Prévention,
carte "Préparez-vous" avec guide de prévention, bouton **"Appel d'urgence (SOS)"** sur le détail d'alerte,
lien "Mot de passe oublié ?", boutons de contrôle carte (calques/position) sur l'écran Itinéraire. Ces
éléments ne sont pas encore décidés — à traiter dans une passe dédiée si retenus.

---

*Flowdar DESIGN.md — v2 — Nlend Max — ATL 2026 — réconcilié avec l'export Stitch*
