import { Component } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {

  email: string ='';

  sendPasswordResetEmail(email: string) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email).then(() => {}).catch((error) => {});
  }


}
