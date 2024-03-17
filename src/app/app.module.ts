import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LogInComponent } from './authentication/log-in/log-in.component';
import { RegisterComponent } from './authentication/register/register.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StartScreenComponent } from './start-screen/start-screen.component';
import {DialogModule} from '@angular/cdk/dialog';
import { HeaderComponent } from './authentication/header/header.component';
import { FooterComponent } from './authentication/footer/footer.component'; 

import { provideAuth, getAuth } from '@angular/fire/auth';
import {  getApp,  } from '@angular/fire/app';
import { AuthService } from './auth.service';
import { MainSectionComponent } from './main-section/main-section.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
import { UploadDialogComponent } from './authentication/register/upload-dialog/upload-dialog.component';
import { AuthenticationComponent } from './authentication/authentication.component';
 import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MassagerComponent } from './main-section/massager/massager.component';
import { SecondMessagerComponent } from './main-section/second-messager/second-messager.component';
import { DownloadConfirmDialogComponent } from './download-confirm-dialog/download-confirm-dialog.component';
import { EditMessageDialogComponent } from './edit-message-dialog/edit-message-dialog.component';
import { MatIconModule } from '@angular/material/icon';



import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputSendigComponent } from './input-sendig/input-sendig.component';
import { MessageInputComponent } from './main-section/message-input/message-input.component';
import { MessageCardComponent } from './main-section/message-card/message-card.component';

import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserActionsDialogComponent } from './main-section/user-actions-dialog/user-actions-dialog.component';
import { UserEditDialogComponent } from './main-section/user-edit-dialog/user-edit-dialog.component';
 import { VerifyEmailInstructionComponent } from './main-section/verify-email-instruction/verify-email-instruction.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ChannelInfoDialogComponent } from './main-section/channel-info-dialog/channel-info-dialog.component';
import { ResponsiveDashboardComponent } from './main-section/responsive-dashboard/responsive-dashboard.component';
import { ResponsivMainChatComponent } from './main-section/responsiv-main-chat/responsiv-main-chat.component';
import { ResponsivSecondChantComponent } from './main-section/responsiv-second-chant/responsiv-second-chant.component';
import { ChatNavigationComponent } from './main-section/chat-navigation/chat-navigation.component';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    StartScreenComponent,
    HeaderComponent,
    FooterComponent,
    MainSectionComponent,
    PasswordResetComponent,
    AddChannelDialogComponent,
    UploadDialogComponent,
    AuthenticationComponent,
    MassagerComponent,
    SecondMessagerComponent,
    DownloadConfirmDialogComponent,
    EditMessageDialogComponent,
    InputSendigComponent,
    MessageInputComponent,
    MessageCardComponent,
    UserMenuComponent,
    UserActionsDialogComponent,
    UserEditDialogComponent,
    VerifyEmailInstructionComponent,
    EmailVerificationComponent,
    ChannelInfoDialogComponent,
    ResponsiveDashboardComponent,
     ResponsivMainChatComponent,
    ResponsivSecondChantComponent,
    ChatNavigationComponent,
   
  ],
  imports: [
    PickerModule, 
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
   
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp({
    "apiKey": "AIzaSyAFMztW93yD9x_BwFLQThnX4KP_E1Hpc4A",
    "authDomain": "dabubble-7d65b.firebaseapp.com",
    "projectId": "dabubble-7d65b",
    "storageBucket": "dabubble-7d65b.appspot.com",
    "messagingSenderId": "36164365029",
    "appId": "1:36164365029:web:0c701dfea8e055ea66020c"
  })),
  provideAuth(() => getAuth()),

    BrowserAnimationsModule,
    DialogModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent, ]
})
export class AppModule {}
