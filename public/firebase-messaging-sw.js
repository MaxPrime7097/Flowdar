/* eslint-disable no-undef */
// Service worker Firebase Cloud Messaging - recoit les notifications quand l'app est fermee
// ou en arriere-plan (Flowdar : alertes d'inondation sur le quartier de l'utilisateur).
//
// Ce fichier est servi a la racine (/firebase-messaging-sw.js) : il est copie tel quel depuis
// public/ par le build Angular. Il ne peut PAS importer environment.ts (contexte worker isole),
// donc la configuration Firebase lui est transmise en parametres d'URL au moment de
// l'enregistrement (voir push.service.ts). Cela evite de dupliquer les cles ici et de se
// retrouver avec une configuration desynchronisee.
//
// La version des scripts doit rester alignee sur celle du paquet npm "firebase" (12.16.0).

importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js');

const parametres = new URLSearchParams(location.search);

firebase.initializeApp({
  apiKey: parametres.get('apiKey'),
  authDomain: parametres.get('authDomain'),
  projectId: parametres.get('projectId'),
  storageBucket: parametres.get('storageBucket'),
  messagingSenderId: parametres.get('messagingSenderId'),
  appId: parametres.get('appId'),
});

const messaging = firebase.messaging();

// Notification recue alors que l'app n'est pas au premier plan.
messaging.onBackgroundMessage((payload) => {
  const titre = payload.notification?.title ?? 'Alerte Flowdar';
  self.registration.showNotification(titre, {
    body: payload.notification?.body ?? '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    // Regroupe les notifications d'une meme zone au lieu de les empiler.
    tag: payload.data?.zone_id ?? 'flowdar-alerte',
    data: { url: payload.data?.url ?? '/notifications' },
  });
});

// Clic sur la notification : ouvre l'onglet Flowdar existant s'il y en a un, sinon en ouvre un.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destination = event.notification.data?.url ?? '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ongletsOuverts) => {
      for (const onglet of ongletsOuverts) {
        if ('focus' in onglet) {
          onglet.navigate(destination);
          return onglet.focus();
        }
      }
      return clients.openWindow(destination);
    }),
  );
});
