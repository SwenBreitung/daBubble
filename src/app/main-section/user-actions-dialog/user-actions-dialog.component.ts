import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {ChannelService} from './../../firebase-services/channels.service'
import { AuthService } from './../../auth.service';
import { AddChannelDialogComponent } from '../../add-channel-dialog/add-channel-dialog.component';
import { Router } from '@angular/router';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-user-actions-dialog',
  templateUrl: './user-actions-dialog.component.html',
  styleUrl: './user-actions-dialog.component.scss'
})
export class UserActionsDialogComponent {
[x: string]: any;
constructor(   
  public channelService: ChannelService,
  private dialogRef: MatDialogRef<AddChannelDialogComponent>,
  public  authService: AuthService,
  private router: Router ,
  public dialog: MatDialog,
  ){}
 
closeDialog(){
  // this.channelService.addChannel(this.channel.toJson());
  this.dialogRef.close();
}

async logOut() {
  this.closeDialog();
  localStorage.removeItem('dabuble/username');
  this.authService.logout();
  this.router.navigate(['/login']);
}

openDialogChat() {
  this.closeDialog();
  let dialogConfig = {
    width: '40vw',
    height: '60vh',
    position: { top: '100px', right: '26px' },
  };

  // Prüfen der Fensterbreite und Anpassen der Konfiguration bei Bedarf
  if (window.innerWidth < 700) {
    dialogConfig = {
      ...dialogConfig, // Behalte andere Einstellungen bei
      width: '80vw', // Neue Breite als Beispiel
      height: '80vh', // Neue Höhe als Beispiel
      position: { top: '', right: '' }, // Entferne Positionierung, wenn gewünscht
    };
  }
  
  const dialogRef = this.dialog.open(UserEditDialogComponent, dialogConfig);


}
}
