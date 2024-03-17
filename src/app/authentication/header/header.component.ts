import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NoteListService } from '../../firebase-services/note-list.service'
import {MatDialog,} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component'
import { Event as RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isRegisterPage: boolean = false;
  constructor(
    public dialog: MatDialog,
    private noteService: NoteListService,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
  ) {
   
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isRegisterPage = this.router.url.includes('/register');
    });
  }
  }
  





// Hören Sie auf Änderungen der Route

