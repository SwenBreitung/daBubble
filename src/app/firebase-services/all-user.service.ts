import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, query, getDocs, where, doc, setDoc, getDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Channel} from './../models/channel.class';
@Injectable({
  providedIn: 'root'
})
export class AllUserService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}



  async isEmailTaken(email: string){
    const usernamesRef = collection(this.firestore, 'allEmails');
    const q = query(usernamesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  }


  async isUsernameTaken(username: string): Promise<boolean> {
    const usernamesRef = collection(this.firestore, 'allUsernames');
    const q = query(usernamesRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  }
 

  async addUsername(username: string, userId: string): Promise<void> {
    const usernameRef = doc(this.firestore, `usernames/${username}`);
    await setDoc(usernameRef, { userId: userId });
  }

  
  async addEmail(email: string): Promise<void> {
    try {
      const usernamesRef = collection(this.firestore, 'allEmails');
      await addDoc(usernamesRef, { email: email });
    } catch (error) {}
  
  }


  async addName(username: string): Promise<void> {
    try {
      const usernamesRef = collection(this.firestore, 'allUsernames');
      await addDoc(usernamesRef, { username: username });
    } catch (error) {}
  }

  
  getUsersData() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<Channel[]>;
  }
  
}