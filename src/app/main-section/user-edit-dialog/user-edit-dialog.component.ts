import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../auth.service'
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
  ) { }
  @ViewChild(UserActionsDialogComponent) actionDialog: UserActionsDialogComponent | undefined;


  userForm = this.fb.group({
    userName: [this.authService.currentUser.name, [Validators.required, Validators.minLength(4)]],
    userEmail: [this.authService.currentUser.email, [Validators.required, Validators.email]]
  });

  switchContainer: number = 0;
  userEmail: string = '';
  userName: string = '';
  switchSecondContainer: number = 0;


  troggleSwitchContainer() {
    this.switchContainer = this.switchContainer === 0 ? 1 : 0;
  }


  troggleSwitchSecondContainer() {
    this.switchSecondContainer = this.switchSecondContainer === 0 ? 1 : 0;
  }


  close() {
    this.dialogRef.close();
  }


  async saveInput() {
    if (this.userForm.valid) {
      this.troggleSwitchSecondContainer();
      this.updateUsername();
      this.updateEmail();
    } else {}
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
    if (this.userForm.get('userEmail')?.value.length > 0) {




      const newEmail = this.userForm.get('userEmail')?.value;
      if (newEmail && newEmail.length > 0) {
        const userEmailValue: string = this.userForm.get('userEmail')?.value;
        this.noteService.updateObjectField(this.authService.currentUser.uid, 'email', userEmailValue, 'users');
        this.authService.updateEmailAddress(newEmail)
      }
    }
  }


  updateUsername() {
    if (this.userForm.get('userName')?.value.length > 0) {
      const userNameValue: string = this.userForm.get('userName')?.value;
      this.noteService.updateObjectField(this.authService.currentUser.uid, 'name', userNameValue, 'users');
    }
  }
}