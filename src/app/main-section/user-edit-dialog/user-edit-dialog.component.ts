import { Component,OnInit } from '@angular/core';
import {AuthService} from './../../auth.service'
import { MatDialogRef } from '@angular/material/dialog';
import { NoteListService } from '../../firebase-services/note-list.service';
import { Router } from '@angular/router';
//import {UserActionsDialogComponent} from './../user-actions-dialog/user-actions-dialog.component'
import { ViewChild, AfterViewInit } from '@angular/core';
import { UserActionsDialogComponent } from '../user-actions-dialog/user-actions-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss'
})
export class UserEditDialogComponent {
  constructor(
    public authService: AuthService,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    public noteService: NoteListService,
    public router: Router,
    public fb: FormBuilder,
  ){}
  @ViewChild(UserActionsDialogComponent) actionDialog: UserActionsDialogComponent | undefined;


  userForm = this.fb.group({
    userName: [this.authService.currentUser.name, [Validators.required, Validators.minLength(4)]],
    userEmail: [this.authService.currentUser.email, [Validators.required, Validators.email]]
  });

  switchContainer: number = 0; 
  userEmail:string='';
  userName:string = '';
  switchSecondContainer:number =0;


  troggleSwitchContainer(){
   this.switchContainer = this.switchContainer === 0 ? 1 : 0;
  }


  troggleSwitchSecondContainer(){
    this.switchSecondContainer = this.switchSecondContainer === 0 ? 1 : 0;
  }


  close(){
    this.dialogRef.close();
  }


  async  saveInput() {
    if (this.userForm.valid) {
      console.log(this.authService.currentUser);
      this.troggleSwitchSecondContainer();

      this.updateUsername();
     
      this.updateEmail();
     
   
      // Logik zum Speichern der Daten, wenn das Formular gültig ist
      console.log(this.userForm.value);
    } else {
      // Behandeln von ungültigen Eingaben
      console.error('Formular ist nicht gültig.');
    }
  }


  // async  updateEmail(){
  //   const newEmail = this.userForm.get('userEmail')?.value;
  //   if (newEmail && newEmail.length > 0) {
  //     try {
  //       await this.authService.updateEmailAddress(newEmail);
  //        await this.authService.sendVerificationEmail(); // Jetzt sendet dies eine Verifizierungs-E-Mail an die neue Adresse
  //     } catch (error) {
  //       console.error('Fehler bei der Aktualisierung der E-Mail', error);
  //     // Fehlerbehandlung...
  //     }
  //   }
  // }

  async updateEmail() {
    if(this.userForm.get('userEmail')?.value.length > 0){
      const userEmailValue: string = this.userForm.get('userEmail')?.value;
      this.noteService.updateObjectField(this.authService.currentUser.uid,'email', userEmailValue,'users' );
      console.log(userEmailValue ,'email')
    }
  
    const newEmail = this.userForm.get('userEmail')?.value;
    if (newEmail && newEmail.length > 0) {
      const user = this.authService.auth.currentUser;
      if (user) {
        // Wenn die aktuelle E-Mail verifiziert ist, versuche die neue E-Mail zu aktualisieren.
        try {
          await this.authService.updateEmailAddress(newEmail);
          console.log('E-Mail-Adresse wurde aktualisiert.');
        } catch (error) {
          console.error('Fehler bei der Aktualisierung der E-Mail', error);
        }
      } else {
        // Wenn die aktuelle E-Mail nicht verifiziert ist, sende eine Verifizierungs-E-Mail.
        try {
          await this.authService.sendVerificationEmail();
          console.log('Verifizierungs-E-Mail wurde gesendet.');
        } catch (error) {
          console.error('Fehler beim Senden der Verifizierungs-E-Mail', error);
        }
      }
    }
  }


  updateUsername(){

    if(this.userForm.get('userName')?.value.length > 0){
      const userNameValue: string = this.userForm.get('userName')?.value;
      this.noteService.updateObjectField(this.authService.currentUser.uid,'name', userNameValue,'users' );
    }
  }

}