import { Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { firebaseAuth, firestore } from '../firebase';
import { MOCK_UTILISATEUR } from '../mock-data';
import { Utilisateur } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => (this.currentUser = user));
  }

  connexionEmail(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  connexionGoogle() {
    return signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  }

  // Firebase envoie lui-meme l'e-mail de reinitialisation et heberge la page de saisie du
  // nouveau mot de passe : aucun ecran ni endpoint backend a creer de notre cote.
  reinitialiserMotDePasse(email: string) {
    return sendPasswordResetEmail(firebaseAuth, email);
  }

  async inscription(email: string, password: string, quartierDomicile: string) {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await setDoc(doc(firestore, 'utilisateurs', credential.user.uid), {
      uid: credential.user.uid,
      nom: credential.user.displayName ?? '',
      email,
      quartier_domicile: quartierDomicile,
    });
    return credential;
  }

  deconnexion() {
    return signOut(firebaseAuth);
  }

  // Observable<User | null> - suit les changements d'etat de connexion
  getUtilisateurActuel(): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      return onAuthStateChanged(firebaseAuth, (user) => subscriber.next(user));
    });
  }

  // Profil complet (nom, email, quartier de domicile) stocke dans Firestore a l'inscription
  // (Ecran Profil - pas d'endpoint backend dedie, donnees geree cote Angular/Firebase).
  getProfil(): Observable<Utilisateur | null> {
    if (environment.useMockData) {
      return of(MOCK_UTILISATEUR);
    }
    const uid = this.currentUser?.uid;
    if (!uid) {
      return of(null);
    }
    return new Observable<Utilisateur | null>((subscriber) => {
      getDoc(doc(firestore, 'utilisateurs', uid)).then(
        (snapshot) => {
          subscriber.next(snapshot.exists() ? (snapshot.data() as Utilisateur) : null);
          subscriber.complete();
        },
        (error) => subscriber.error(error),
      );
    });
  }

  // uid du compte connecte, ou null. Utilise par push.service pour rattacher le token FCM
  // au bon profil Firestore.
  async getUidActuel(): Promise<string | null> {
    if (this.currentUser) {
      return this.currentUser.uid;
    }
    // Au tout premier chargement, onAuthStateChanged n'a pas encore repondu : on attend
    // sa premiere emission plutot que de conclure a tort que personne n'est connecte.
    return new Promise<string | null>((resolve) => {
      const desabonner = onAuthStateChanged(firebaseAuth, (user) => {
        desabonner();
        resolve(user?.uid ?? null);
      });
    });
  }

  // Utilise par les guards (auth.guard / no-auth.guard) et par les actions Confirmer/C'est passe.
  // En mode mock, aucun vrai compte Firebase n'est configure : on se considere "connecte" pour
  // pouvoir parcourir tout le parcours utilisateur sans backend ni Firebase reels.
  estConnecte(): boolean {
    return environment.useMockData || this.currentUser !== null;
  }
}
