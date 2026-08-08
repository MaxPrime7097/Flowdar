# Flowdar — Configuration du frontend

Checklist pour passer du **mode démo** (données factices, aucune clé nécessaire) au **mode réel**
(Firebase + Google Maps + API de Mr Ebanga).

> **Frontend** : Nlend Max — **Backend** : Mr Ebanga Arnaud
> Angular ne calcule jamais le score et n'appelle jamais OpenWeatherMap ni Google Elevation.

---

## 0. Lancer l'app aujourd'hui (sans rien configurer)

```bash
npm install
npm start          # http://localhost:4200
```

`useMockData: true` dans [`src/environments/environment.development.ts`](src/environments/environment.development.ts)
fait tourner toute l'app sur des données de démo. Tous les écrans sont navigables, l'authentification
est contournée, aucun appel réseau n'est fait.

**Seule exception** : la carte Google Maps a besoin d'une vraie clé même en mode démo — c'est le
script Google qui est chargé, pas nos données. Sans clé, les écrans Carte et Itinéraire restent gris.

---

## 1. Google Cloud Console — clé Maps

1. Créer un projet sur [console.cloud.google.com](https://console.cloud.google.com)
2. Activer la facturation (obligatoire pour Maps ; il y a un crédit mensuel gratuit)
3. **APIs et services → Bibliothèque**, activer :

   | API | Sert à |
   |---|---|
   | **Maps JavaScript API** | carte, marqueurs (écrans 1, 2, 5) |
   | **Directions API** | itinéraire sécurisé (écran 5) |
   | **Places API** | autocomplétion des adresses (écrans 1, 5) |

   > ⚠️ Google propose « Places API » **et** « Places API (New) ». Le code utilise
   > `google.maps.places.Autocomplete`, qui dépend de l'**ancienne** « Places API ».
   > Si l'autocomplétion ne marche pas, c'est presque toujours ça.

4. **Identifiants → Créer des identifiants → Clé API**
5. **Restreindre la clé immédiatement** (voir §4) — puis la coller dans `googleMapsApiKey`.

---

## 2. Firebase Console — Auth, Firestore, Storage, Hosting

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer les 4 services :

   | Service | Réglage |
   |---|---|
   | **Authentication** | Activer *Adresse e-mail/Mot de passe* **et** *Google* |
   | **Firestore Database** | Créer la base (mode production) |
   | **Storage** | Créer le bucket (photos des signalements) |
   | **Cloud Messaging** | Notifications push (voir §2 bis) |
   | **Hosting** | Pour le déploiement final |

3. **Paramètres du projet → Vos applications → Ajouter une application Web**
4. Firebase affiche un bloc `firebaseConfig` : copier les 6 valeurs dans `firebaseConfig`.

### Clé VAPID — obligatoire pour les notifications push

**Paramètres du projet → Cloud Messaging → Certificats push Web → Générer une paire de clés**,
puis copier la clé dans `firebaseVapidKey`.

Sans elle, l'app fonctionne normalement mais l'activation des notifications échoue proprement :
l'écran affiche « Activation impossible sur cet appareil ».

### Règles de sécurité Firestore

L'app lit la collection `alertes` en temps réel et écrit dans `utilisateurs` à l'inscription.
Les règles par défaut (mode production) bloquent tout — à adapter avec Mr Ebanga, par exemple :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Alertes : lecture publique, écriture réservée au backend (SDK Admin)
    match /alertes/{alerteId} {
      allow read: if true;
      allow write: if false;
    }
    // Profil : chacun lit et écrit uniquement le sien
    match /utilisateurs/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## 3. Backend de Mr Ebanga — juste l'URL

Rien à créer ici : renseigner `backendUrl`.

- **En développement** : `http://localhost:3000` (déjà en place)
- **En production** : l'URL déployée qu'il te communiquera

### Endpoints consommés par le frontend

| Endpoint | Méthode | Écran |
|---|---|---|
| `/api/alertes` | GET | Carte (1) |
| `/api/alertes?type=preventive` | GET | Prévention (3) |
| `/api/alertes/:id` | GET | Détail (2) — avec `score_detail` |
| `/api/alertes/:id/confirmer` | POST | Détail (2) |
| `/api/alertes/:id/resoudre` | POST | Détail (2) |
| `/api/alertes/:id/confirmations` | GET | Détail (2) |
| `/api/alertes/historique/:quartier` | GET | Historique (6) |
| `/api/alertes/signaler` | POST | Signalement (4) |
| `/api/zones-a-risque` | GET | Signalement (4), Inscription (7) |
| `/api/scores` | GET | `score.service` |
| `/api/meteo/actuelle` | GET | Carte (1) |
| `/api/meteo/previsions` | GET | Prévention (3) |
| `/api/meteo/horaire` | GET | Prévention (3) — **contrat à figer, voir §6** |

---

## 4. Sécurité — à faire AVANT le premier commit des clés

Les clés Google Maps et Firebase sont **forcément visibles** dans le code compilé côté navigateur.
C'est normal et documenté dans les spécifications v3 — la protection ne passe pas par le secret,
mais par les **restrictions d'usage**.

⚠️ Les fichiers `src/environments/*.ts` **ne sont pas** dans `.gitignore`. Dès que tu y mets tes
vraies clés et que tu committes, elles partent sur GitHub. C'est acceptable **uniquement si** les
restrictions ci-dessous sont déjà en place.

### Clé Google Maps
**Cloud Console → Identifiants → ta clé → Restrictions relatives aux applications → Sites web**, ajouter :
```
http://localhost:4200/*
https://<ton-projet>.web.app/*
https://<ton-projet>.firebaseapp.com/*
```
Puis **Restrictions relatives aux API** → limiter aux 3 APIs du §1.

Sans ça, n'importe qui peut réutiliser la clé et la facturation tombe sur ton compte.

### Clé Firebase
**Firebase Console → Authentication → Settings → Domaines autorisés** : ne garder que `localhost`
et tes domaines de production.

---

## 5. Déploiement

```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # dossier public : dist/flowdar/browser
npm run build             # build de production
firebase deploy
```

Avant de déployer : renseigner [`src/environments/environment.ts`](src/environments/environment.ts)
(le fichier de **production**, `useMockData: false`) et ajouter le domaine Firebase aux restrictions du §4.

---

## 6. À confirmer avec Mr Ebanga

| Sujet | État |
|---|---|
| **Prévisions horaires par ville** | Confirmé comme prévu. Le frontend appelle `GET /api/meteo/horaire` en attendant `[{ heure: ISO, pluie_mm_h: number }]`. **URL et forme exactes à valider** — c'est un contrat provisoire posé côté Angular. |
| **Envoi des notifications push** | Le frontend est prêt (voir §6 quater). **Il reste à Mr Ebanga d'écrire l'envoi côté serveur** — sans ça, aucune notification n'arrivera jamais. |

---

## 6 quater. Notifications push (FCM) — répartition des rôles

C'est une fonctionnalité **à deux moitiés**. La moitié Angular est faite ; la moitié serveur ne
l'est pas, et sans elle rien n'arrive jamais sur les téléphones.

### ✅ Ce qui est fait côté Angular

| Élément | Rôle |
|---|---|
| [`push.service.ts`](src/app/core/services/push.service.ts) | Demande la permission, récupère le token FCM, écoute les messages reçus app ouverte |
| [`public/firebase-messaging-sw.js`](public/firebase-messaging-sw.js) | Affiche les notifications **app fermée**, gère le clic |
| [`/notifications`](src/app/features/notifications/notifications.ts) | Écran d'activation + historique local des messages reçus |
| Cloche 🔔 | Mène à `/notifications`, avec pastille rouge du nombre de non-lues |

Le token est enregistré dans Firestore sur `utilisateurs/{uid}.fcm_tokens` — un **dictionnaire**
`{ token: date }`, car un même compte peut avoir plusieurs appareils.

> La config Firebase est transmise au service worker en **paramètres d'URL** au moment de
> l'enregistrement. C'est volontaire : un worker ne peut pas lire `environment.ts`, et recopier les
> clés dans le `.js` créerait une seconde source de vérité qui se désynchronise tôt ou tard.

### ❌ Ce que Mr Ebanga doit écrire

Quand une alerte dépasse le seuil d'un quartier, le backend doit :

1. lire les utilisateurs dont `quartier_domicile` correspond à la zone concernée ;
2. collecter leurs `fcm_tokens` ;
3. envoyer via le **SDK Firebase Admin** (pas d'appel HTTP à faire côté Angular) :

```javascript
// Backend — Node.js, firebase-admin
await admin.messaging().sendEachForMulticast({
  tokens: tokensDesUtilisateursDuQuartier,
  notification: {
    title: 'Alerte inondation — Ndokotti',
    body: 'Score 87/100. Évitez le secteur.',
  },
  data: {
    zone_id: 'zone-ndokotti',              // regroupe les notifications d'une même zone
    url: '/alerte/alerte-1',               // page ouverte au clic
  },
});
```

Les champs `data.zone_id` et `data.url` sont **lus par notre service worker** : `zone_id` sert de
`tag` (évite d'empiler 10 notifications pour le même quartier), `url` détermine la page ouverte au
clic. S'ils sont absents, le worker retombe sur des valeurs par défaut.

Enfin, **nettoyer les tokens périmés** : `sendEachForMulticast` renvoie les échecs
`messaging/registration-token-not-registered` — ces tokens doivent être supprimés du profil,
sinon ils s'accumulent indéfiniment.

### Limites connues

- **iOS** : les notifications push web n'existent que depuis iOS 16.4, et **uniquement si l'app est
  ajoutée à l'écran d'accueil**. Dans Safari onglet classique, `isSupported()` renvoie `false` et
  l'écran affiche « Notifications indisponibles ».
- **HTTPS obligatoire** — sauf sur `localhost`, autorisé pour le développement.
- L'historique des notifications est **local à l'appareil** (`localStorage`, 50 dernières). Changer
  de téléphone ou vider le cache le remet à zéro. Pour un historique partagé entre appareils, il
  faudrait une collection Firestore dédiée — non fait, non spécifié.

---

## 6 bis. ⚠️ Numéros d'urgence — à vérifier avant la mise en ligne

Les numéros vivent dans **un seul fichier** : [`src/app/core/urgence.ts`](src/app/core/urgence.ts).
Ils sont utilisés pendant une urgence réelle — une erreur ici peut coûter une vie.

| Service | Numéro (mobile) | Rôle dans l'app |
|---|---|---|
| **Sapeurs-pompiers (CNSP)** | **118** | **Service principal en cas d'inondation** (sauvetage, évacuation) |
| SAMU | 119 | Blessé, urgence médicale |
| Police | 117 | Route coupée, sécurité des personnes |
| Urgence GSM universelle | 112 | Fonctionne sans crédit ni SIM active |

> Depuis un poste fixe, les numéros courts sont sans le `1` (17, 18, 19). L'app cible des
> smartphones, donc les formes mobiles sont utilisées.

**Ces numéros proviennent de recherches web concordantes, pas d'une confirmation officielle.**
Avant la mise en ligne, fais-les valider par au moins une de ces sources :

- le **Corps National des Sapeurs-Pompiers**, délégation de Douala (le plus fiable) ;
- la **Direction de la Protection Civile** (MINAT), qui coordonne les secours en cas de catastrophe ;
- la **Communauté Urbaine de Douala**, qui a participé à la cartographie des inondations de 2020.

Vérifie aussi s'il existe un **numéro local dédié à Douala** — plusieurs villes en ont un en plus
des numéros nationaux. Si oui, ajoute-le en tête de `SERVICES_URGENCE`.

> ❗ L'**ONACC** apparaît dans l'app comme source de données (`source: 'onacc'`) mais c'est un
> **observatoire climatique, pas un service de secours**. Ne jamais y router un appel d'urgence.

---

## 6 ter. Guide de prévention

L'écran [`/guide-prevention`](src/app/features/guide-prevention/guide-prevention.ts) est **du contenu
éditorial écrit côté frontend**, pas des données backend. Il suit les recommandations standard de
sécurité inondation (Croix-Rouge / OMS), adaptées au contexte de Douala : caniveaux obstrués par les
déchets, moto-taxis, risque de choléra après immersion.

Les consignes marquées `critique: true` s'affichent en rouge (traversée de l'eau, électricité,
symptômes post-inondation). Le texte est modifiable directement dans le tableau `SECTIONS` du
composant.

**À faire relire** par quelqu'un du domaine — sapeurs-pompiers, Croix-Rouge camerounaise ou
services de santé — avant la mise en ligne. Le contenu est solide mais n'a pas été validé par un
professionnel du secours.

### Choix déjà arbitrés

- **Écran Prévention = deux sources.** Les alertes préventives réelles
  (`/api/alertes?type=preventive`) et les scores prévisionnels bruts (`/api/meteo/previsions`) sont
  fusionnés par quartier. En cas de doublon, l'alerte réelle gagne — elle porte un `id` et ouvre
  l'écran de détail ; une prévision brute affiche simplement « PRÉVISION MÉTÉO ».
- **Photos hors ligne.** Un signalement fait sans réseau est mis en file d'attente `localStorage`
  et rejoué à la reconnexion, **sans sa photo** (l'upload Firebase Storage est impossible hors ligne).

---

## 7. Vérifier que tout marche

```bash
npx tsc --noEmit -p tsconfig.app.json    # types
npm run build                            # build de production
npm test                                 # tests unitaires
```

> `npm test` remonte des échecs sur les specs générés automatiquement par le CLI Angular
> (ils instancient des composants sans leurs `input.required`). Ce sont des squelettes jamais
> complétés, pas des régressions.

### À propos de la taille du bundle

Le seuil d'alerte de `angular.json` est à **1,1 Mo** au lieu du 900 ko par défaut du CLI. Ce n'est
pas pour masquer un problème :

- le bundle initial fait **977 ko bruts mais 242 ko transférés** (compressés) — c'est ce que
  télécharge réellement l'utilisateur, et c'est correct pour du mobile ;
- l'essentiel est Firebase **Auth + Firestore**, nécessaires dès le démarrage (état de connexion,
  alertes temps réel). Les rendre paresseux ne ferait que retarder l'affichage de la carte.

`firebase/messaging` (~34 ko), lui, **est** chargé dynamiquement : seuls les utilisateurs qui
activent les notifications le téléchargent. Le seuil d'erreur reste à 1,5 Mo pour attraper une
vraie régression (une grosse bibliothèque importée par accident dans le bundle initial).

### Tester le mode hors ligne
DevTools → onglet **Réseau** → passer en *Offline*, puis :
- la carte doit afficher le bandeau « Données hors ligne — dernière MAJ HH:MM » ;
- un signalement envoyé doit afficher « Pas de connexion : signalement enregistré sur cet appareil » ;
- au retour en ligne, il part automatiquement (vérifiable dans l'onglet Réseau).
