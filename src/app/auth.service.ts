import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, Auth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, createUserWithEmailAndPassword, signOut, updateEmail, verifyBeforeUpdateEmail, } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Unsubscribe, sendEmailVerification, signInAnonymously as firebaseSignInAnonymously, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(public auth: Auth) { }
  currentUser: any;

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }


  signInAnonymously() {
    const auth = getAuth();
    return firebaseSignInAnonymously(auth);
  }


  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }


  getCurrentUser() {
    return this.currentUser;
  }


  async logout() {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) { }
  }



  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Einfacher Regex für die Überprüfung von E-Mail-Adressen
    return regex.test(email);
  }


  async sendVerificationToNewEmail(newEmail: string): Promise<void> {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('InvalidEmailFormat');
    }

    const user = this.auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        throw error; // Weiterleiten des Fehlers für eventuelle Fehlerbehandlung außerhalb der Funktion
      }
    } else {
      throw new Error('Kein Benutzer angemeldet');
    }
  }

  async changeEmail(newEmail: string): Promise<void> {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('InvalidEmailFormat');
    }
    const user = this.auth.currentUser;
    if (user) {
      try {

        await updateEmail(user, newEmail);
        await sendEmailVerification(user);
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Kein Benutzer angemeldet');
    }
  }


  async updateEmailAddress(newEmail: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await verifyBeforeUpdateEmail(user, newEmail);
      } catch (error) {}
    } else {}
  }


  async sendVerificationEmail() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await sendEmailVerification(user)
        .then(() => { })
        .catch((error) => {});
    } else {
      throw new Error('Kein Benutzer ist eingeloggt.');
    }
  }


}
