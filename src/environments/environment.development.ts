export const environment = {
  production: false,
  backendUrl: 'http://localhost:3000', // API REST fournie par Mr Ebanga Arnaud
  googleMapsApiKey: 'REPLACE_WITH_GOOGLE_MAPS_API_KEY',
  firebaseConfig: {
    apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
    authDomain: 'REPLACE_WITH_FIREBASE_AUTH_DOMAIN',
    projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
    storageBucket: 'REPLACE_WITH_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'REPLACE_WITH_FIREBASE_APP_ID',
  },
  // Notifications push : Firebase Console > Cloud Messaging > Certificats push Web
  firebaseVapidKey: 'REPLACE_WITH_FIREBASE_VAPID_KEY',
  useMockData: true, // bascule vers l'API reelle quand le backend de Mr Ebanga est pret
};
