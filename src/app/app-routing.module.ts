import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from './authentication/register/register.component';
// import {StartScreenComponent} from './start-screen/start-screen.component';
import {LogInComponent} from './authentication/log-in/log-in.component'
import { MainSectionComponent } from './main-section/main-section.component';
import { PasswordResetComponent } from './authentication/password-reset/password-reset.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import { VerifyEmailInstructionComponent } from './main-section/verify-email-instruction/verify-email-instruction.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
// import { ResponsivMainChatComponent } from './main-section/responsiv-main-chat/responsiv-main-chat.component';
// import { ResponsiveDashboardComponent } from './main-section/responsive-dashboard/responsive-dashboard.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import{UpdateEmailComponent } from './update-email/update-email.component'
import { CommonModule } from '@angular/common';
const routes: Routes = [
  { 
    path: '', component: AuthenticationComponent,
                children: [
                  { path: '', component: LogInComponent },
                  { path: 'register', component: RegisterComponent },
                  { path: 'login', component: LogInComponent },
                ]
  },
    { path: 'main-section', component: MainSectionComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'verify-email', component: VerifyEmailInstructionComponent },
    { path: 'verify-email', component: EmailVerificationComponent },
    //{ path: 'app-responsiv-main-chat/:param1/:param2', component: ResponsivMainChatComponent },
    // { path: 'app-responsiv-main-chat', component: ResponsivMainChatComponent },
    // { path: 'app-responsive-dashboard', component: ResponsiveDashboardComponent },
    {path:'impressum', component:ImpressumComponent}, 
    {path:'privacy-policy', component:PrivacyPolicyComponent}, 
    {path:'update-email', component:UpdateEmailComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { 
  
}
