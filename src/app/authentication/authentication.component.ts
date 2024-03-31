import { Component, OnInit  } from '@angular/core';
import { trigger, state, style, animate, transition, useAnimation } from '@angular/animations';
import { animation } from '@angular/animations';
import {AuthService} from './../auth.service'
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
 
  animations: [
    trigger('fadeBackground', [
      state('visible', style({
        opacity: 1
      })),
      state('hidden', style({
        opacity: 0
      })),
      transition('visible => hidden', [
        animate('1500ms ease-out')
      ])
    ]),

    
    trigger('slideAndFade', [
      transition(':enter', [
        style({ transform: 'translateY(-100vh)', opacity: 0 }), // Start von oben
        animate('5000ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })), // Zum Mittelpunkt sliden
        animate('4000ms ease-out', style({ transform: 'translateX(-50vw)', opacity: 0 })) // Nach links sliden und ausblenden
      ])
    ])
  ]
})
export class AuthenticationComponent implements OnInit {
  constructor(
    public authService: AuthService,
    ){}
animationState: any;
  ngOnInit(): void {}


  animationDone() {
    this.authService.showBackground = false; 
  }
}
