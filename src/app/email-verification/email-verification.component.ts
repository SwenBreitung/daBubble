import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, applyActionCode } from '@angular/fire/auth';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private auth: Auth,
    public router: Router,
    ) { }

    
  ngOnInit(): void {
    const code = this.route.snapshot.queryParams['oobCode'];
    if (code) {
      this.verifyEmail(code);
    } else {
      this.error = 'Verification code is missing.';
    }
  }


  async verifyEmail(code: string): Promise<void> {
    try {
      await applyActionCode(this.auth, code);
      console.log('Email successfully verified.');
      this.router.navigate(['']);
    } catch (error) {
      console.error('Error verifying email:', error);
      this.error = 'There was an error verifying your email. Please try again.';
    }
  }
}
