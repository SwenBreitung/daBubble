import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component'
import { NoteListService } from '../../service/note-list.service'
import { MatDialog, } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { DialogAddUserComponent } from './../dialog-add-user/dialog-add-user.component';
import { AuthService } from '../../service/auth.service';
import { AllUserService } from '../../service/all-user.service'
import { User } from '../../models/user.class'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})

export class LogInComponent {
  passwort: string = '';
  email: string = '';
  user: User = new User();
  loginError: string = '';
  errorLogin: boolean = false;

  constructor(
    public dialog: MatDialog,
    public noteService: NoteListService,
    private router: Router, 
    private authService: AuthService,
    private allUserService: AllUserService,
  ) { }


  navigateTo() {
    this.router.navigate(['/register']);
  }


  async login() {
    const auth = getAuth();
    const firestore = getFirestore();
    try {
      const cred = await signInWithEmailAndPassword(auth, this.email, this.passwort);
      const userId = cred.user.uid;
      const userDocRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userDetails = docSnap.data();
        this.authService.currentUser = userDetails;
        this.saveUidInLocal(this.authService.currentUser);
        this.router.navigate(['/main-section']);
      } else { }
    } catch (error) { }
  }


  loginAsGuest() {
    this.authService.signInAnonymously().then(cred => {
      this.user.email = cred.user.email ? cred.user.email : "Keine E-Mail";
      this.user.name = cred.user.displayName ? cred.user.displayName : "Gast";
      this.user.uid = cred.user.uid;
      this.user.img = 'https://firebasestorage.googleapis.com/v0/b/dabubble-7d65b.appspot.com/o/profilImg.svg?alt=media&token=ac23c639-088b-4347-aa3e-83e0967d382c';
      this.authService.currentUser = this.user;
      this.saveUidInLocal(this.authService.currentUser);
      this.saveUser();
      this.router.navigate(['/main-section']);
    }).catch(err => { });
  }


  signInWithGoogle() {
    this.authService.signInWithGoogle().then((result) => {
      this.authService.currentUser = result.user;
      this.user.email = result.user.email ? result.user.email : "Keine E-Mail";
      this.user.name = result.user.displayName ? result.user.displayName : "Unbekannt";
      this.user.uid = result.user.uid;
      this.user.img = 'https://firebasestorage.googleapis.com/v0/b/dabubble-7d65b.appspot.com/o/profilImg.svg?alt=media&token=ac23c639-088b-4347-aa3e-83e0967d382c';
      this.authService.currentUser = this.user;
      this.saveUidInLocal(this.authService.currentUser);
      this.saveUser();
      this.router.navigate(['/main-section']);
    }).catch((error) => { });
  }


  saveUidInLocal(user: any) {
    const userString = JSON.stringify(user);
    localStorage.setItem('dabuble/username', userString);
  }


  goToPasswordReset() {
    this.router.navigate(['/main-section'])
  }


  saveUser() {
    this.allUserService.addName(this.user.name);
    const userData: any = this.user.toJson();
    this.noteService.addUser(userData, this.user.uid).then(() => {
    }).catch((error) => { });


    if (this.user.email && this.user.passwort) {
      this.authService.signUp(this.user.email, this.user.passwort);
    } else { }
  }
}
