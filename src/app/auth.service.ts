import { Injectable } from '@angular/core';
import {getAuth,onAuthStateChanged, Auth,signInWithPopup, signInWithEmailAndPassword,GoogleAuthProvider, createUserWithEmailAndPassword, signOut, updateEmail } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Unsubscribe,sendEmailVerification, signInAnonymously as firebaseSignInAnonymously, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  constructor(private auth: Auth) {}
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
      console.log('Erfolgreich ausgeloggt');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  }



  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Einfacher Regex für die Überprüfung von E-Mail-Adressen
    return regex.test(email);
  }
 

  async sendVerificationToNewEmail(newEmail: string): Promise<void> {
    if (!this.isValidEmail(newEmail)) {
      console.error('Die E-Mail-Adresse ist im ungültigen Format:', newEmail);
      throw new Error('InvalidEmailFormat');
    }

    const user = this.auth.currentUser;
    if (user) {
      try {    
        console.log('Temporäre E-Mail-Adresse aktualisiert, um Verifizierung zu senden.');     
        await sendEmailVerification(user);
        console.log('Verifizierungs-E-Mail gesendet.');

      } catch (error) {
        console.error('Fehler beim Senden der Verifizierungs-E-Mail:', error);
        throw error; // Weiterleiten des Fehlers für eventuelle Fehlerbehandlung außerhalb der Funktion
      }
    } else {
      console.log('Kein Benutzer angemeldet');
      throw new Error('Kein Benutzer angemeldet');
    }
  }
  
  async changeEmail(newEmail: string): Promise<void> {
    if (!this.isValidEmail(newEmail)) {
      console.error('Die E-Mail-Adresse ist im ungültigen Format:', newEmail);
      throw new Error('InvalidEmailFormat');
    }
  
    const user = this.auth.currentUser;
    if (user) {
      try {

        await updateEmail(user, newEmail);
        console.log('E-Mail-Adresse erfolgreich aktualisiert');
  
        await sendEmailVerification(user);
        console.log('Verifizierungs-E-Mail gesendet.');
  
      } catch (error) {
        console.error('Fehler beim Aktualisieren der E-Mail-Adresse:', error);
        throw error;
      }
    } else {
      console.log('Kein Benutzer angemeldet');
      throw new Error('Kein Benutzer angemeldet');
    }
  }
  
}
