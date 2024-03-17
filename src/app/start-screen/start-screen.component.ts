import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RegisterComponent} from '../authentication/register/register.component'
import { NoteListService } from '../firebase-services/note-list.service'
import {MatDialog,} from '@angular/material/dialog';
import { LogInComponent } from '../authentication/log-in/log-in.component';
import {  } from '../app.module';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  constructor(
    public dialog: MatDialog,
    private noteService: NoteListService
    //  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  
  ) {}
  // openDialog(componentToOpen?: any) {
  //   const component = componentToOpen || LogInComponent;
  //   this.dialog.open(component, {});
  // }
}
