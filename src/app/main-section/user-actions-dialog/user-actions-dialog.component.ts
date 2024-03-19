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
    this.dialogRef.close();
  }

  async logOut() {
    this.closeDialog();
    localStorage.removeItem('dabuble/username');
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  // openDialogChat() {
  //   this.closeDialog();
  //   let dialogConfig = {
  //     width: '40vw',
  //     height: '60vh',
  //     position: { top: '100px', right: '26px' },
  //   };
  //   if (window.innerWidth < 700) {
  //     dialogConfig = {
  //       ...dialogConfig,
  //       width: '80vw', 
  //       height: '80vh', 
  //       position: { top: '', right: '' }, 
  //     };
  //   }
  //   const dialogRef = this.dialog.open(UserEditDialogComponent, dialogConfig);
  // }


  openDialogChat() {
    this.closeDialog(); 
    const dialogConfig = this.getDialogConfig(); 
    const dialogRef = this.dialog.open(UserEditDialogComponent, dialogConfig); 
  }


  getDialogConfig() {
    let config = this.getDefaultDialogConfig();

    if (this.isSmallScreen()) {
      config = this.getSmallScreenDialogConfig(config);
    }

    return config;
  }


  getDefaultDialogConfig() {
    return {
      width: '40vw',
      height: '60vh',
      position: { top: '100px', right: '26px' }
    };
  }


  getSmallScreenDialogConfig(config:any) {
    return {
      ...config,
      width: '80vw',
      height: '80vh',
      position: { top: '', right: '' }
    };
  }

  
  isSmallScreen() {
    return window.innerWidth < 700;
  }


}
