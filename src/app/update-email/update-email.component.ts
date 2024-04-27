import { Component } from '@angular/core';
import {AuthService} from './../service/auth.service'

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss'
})
export class UpdateEmailComponent {
constructor(
public auth:AuthService,
){}

newEmail='';
verificationCode='';

// applyActionCode(auth: Auth, oobCode: string): Promise<void>;


}
