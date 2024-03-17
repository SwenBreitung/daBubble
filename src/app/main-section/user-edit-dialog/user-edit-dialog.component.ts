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
 private fb: FormBuilder,
){}
@ViewChild(UserActionsDialogComponent) actionDialog: UserActionsDialogComponent | undefined;


userForm = this.fb.group({
  userName: [this.authService.currentUser.name, [Validators.required, Validators.minLength(4)]],
  userEmail: [this.authService.currentUser.email, [Validators.required, Validators.email]]
});

switchContainer = 0;
userEmail:string='';
userName:string = '';

troggleSwitchContainer(){
  this.switchContainer = this.switchContainer === 0 ? 1 : 0;
}
close(){
  this.dialogRef.close();
}

// saveInput(){
//   this.authService.sendVerificationToNewEmail(this.userEmail)
//   this.noteService.updateObjectField(this.authService.currentUser.uid, 'email', this.userEmail);
//   this.authService.currentUser.name = this.userName;
//   this.authService.currentUser.email = this.userEmail;
//   localStorage.setItem('dabuble/username',this.userName);
//   this.noteService.updateObjectField(this.authService.currentUser.uid, 'name', this.userName);
//   this.close();
// }

saveInput(): void {
  if (this.userForm.valid) {
    console.log(this.authService.currentUser);
    // Logik zum Speichern der Daten, wenn das Formular gültig ist
    console.log(this.userForm.value);
  } else {
    // Behandeln von ungültigen Eingaben
    console.error('Formular ist nicht gültig.');
  }
}




}
