import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../../environments/environment';

// Instance Firebase unique de l'app (SDK modulaire, sans @angular/fire -
// @angular/fire ne supporte pas encore Angular 22 au moment de ce scaffold).
export const firebaseApp = initializeApp(environment.firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

// Cache local persistant (IndexedDB) : consultation des alertes/scores hors connexion
// (Frontend Specifications v3, section 8 - "Reseau coupe en cours" / "Retour en ligne").
// Multi-onglets pour ne pas desactiver la persistance si l'app est ouverte dans plusieurs onglets.
export const firestore = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

export const firebaseStorage = getStorage(firebaseApp);
