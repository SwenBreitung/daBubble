import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AllUserService } from '../../service/all-user.service'
import { User} from '../../models/user.class'
import { AuthService } from '../../service/auth.service';
import { NoteListService } from '../../service/note-list.service';
import { FormControl, NG_VALIDATORS, Validators,AbstractControl, Validator  } from '@angular/forms';
import {UploadDialogComponent} from './upload-dialog/upload-dialog.component'
import {MatDialogModule} from '@angular/material/dialog'; 
import {DragAndDropService} from '../../service/drag-drop.service';

type FieldName = 'name' | 'email' | 'password' | 'checkbox';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { waitForAsync } from '@angular/core/testing';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})


export class RegisterComponent{
  selectedImagePath: string = './../../assets/user_avatars/neutral-avatar.svg';
  usernameTaken = false;
  emailTaken = false;

  currentStep: number = 1;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required, 
    Validators.minLength(6),
    Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$') // Beispiel für einen regulären Ausdruck
  ]);
  sendMail = false;

 
  errorLogin:boolean = false;
  user: User = new User();
  checkbox = false;
  errorBooliean = false; 
  submitted = false; 
  
  showErrorName = false;
  showErrorEmail = false;
  showErrorPassword = false;
  showErrorCheckbox = false;

  touched = {
    name: false,
    email: false,
    password: false,
    checkbox: false,
  };


  constructor(
    private noteService: NoteListService,
    private router: Router ,
    private authService: AuthService,
    private allUserService: AllUserService,
    public dialog: MatDialog,
    public dragAndDropService:DragAndDropService,
  ) {}


  
  requiredWithoutSpaces(control: FormControl) {
    const value = control.value.trim(); 
    const isEmpty = !value; 
    return isEmpty ? { required: true } : null;
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }


  goToStep(step: number) {
    this.currentStep = step;
  }

  onBlur(field: FieldName) {
    this.touched[field] = true; 
  }


  checkFieldValidity(field: any): void {
    if (field.invalid && (field.dirty || field.touched)) {
      this.errorBooliean = true; 
    }
  }


  checkEmailValidity() {
    this.showErrorEmail = this.email.invalid;
  }

  checkPasswordValidity() { 
    this.showErrorPassword = this.password.invalid ; 
  }

  async  onSubmit(form: any) {
    if (form.valid  && !await this.checkUsername() && !await this.checkEmail()  ) {
      if(this.currentStep === 1){
        this.goToStep(2)
      }else if(this.currentStep === 2){
        this.saveUser();
        this.router.navigate(['/login']);
      }    
    } else {
      this.errorBooliean = true;
    }
  }

  isInputValid(field: any): boolean {
    return field.valid  && this.errorBooliean ;
  }

  getErrorMessage(field: any, minLength: number, fieldType: string): string {
    if (fieldType === 'name' && this.usernameTaken) {
      return 'Dieser Benutzername ist bereits vergeben.';
    }if( fieldType === 'email' && this.emailTaken) {
      return 'Die E-Mail ist bereits vergeben.';
    }

    if (field.errors?.required) {
      return `Bitte geben Sie einen ${fieldType} ein.`;
    } else if (field.errors?.minlength) {
      return `Es müssen mindestens ${minLength} Zeichen verwendet werden.`;
    } else if (field.errors?.email) {
      return `Bitte geben Sie eine gültige E-Mail-Adresse an.`;
    }
    return '';
  }

  authUser(){}

  async saveUser() {
    const userCredential = await this.authService.signUp(this.user.email, this.user.passwort);
    this.noteService.uid = userCredential.user.uid;
    let imgPfad = await this.uploadSelectedImage();
    this.user.uid = this.noteService.uid;
    this.allUserService.addName(this.user.name);
    this.allUserService.addEmail(this.user.email);
    this.user.img = imgPfad;
    const uid = this.user.uid;
    const userData:any = this.user.toJson();
    await this.noteService.addUser(userData, uid);
  } 

  
  async imgpfad() {
    const uid =  this.noteService.uid;   
    if (this.dragAndDropService && this.dragAndDropService.fileName) {
      const fileNameParts = this.dragAndDropService.fileName.split('.');
      if (fileNameParts.length > 1) {
          const fileExtension = fileNameParts.pop();
          const imagePath = `${uid}/profilImg.${fileExtension}`;
          return imagePath;
      } else {
          return 'defaultImagePath';
        }
    } else {
        return 'defaultImagePath';
    }
  }
  

  async checkEmail()  {
    this.emailTaken = await this.allUserService.isEmailTaken(this.user.email);
    return  this.emailTaken;
  }
  async checkUsername(): Promise<boolean> {
    this.usernameTaken = await this.allUserService.isUsernameTaken(this.user.name);
    return  this.usernameTaken
  }


  async  selectImage(path: string) {
    this.selectedImagePath = path;
    this.dragAndDropService.profileFile = null;
  }


  openDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      data: { key:  'selectedFile'} // Hier kannst du deine Daten einfügen
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  

  async uploadSelectedImage(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (this.dragAndDropService.profileFile) {
        this.dragAndDropService.handleFileDrop(this.dragAndDropService.profileFile)
          .then(url => {   
            resolve(url);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        try {
          const file = await this.convertPathToFile(this.selectedImagePath);
          const url = await this.dragAndDropService.handleFileDrop(file);
          resolve(url); 
        } catch (err) {
          reject(err);
        }
      }
    });
  }

async convertPathToFile(imagePath:string) {
    return fetch(imagePath)
    .then(response => response.blob())
    .then(blob => {
      const filename = imagePath.split('/').pop() || 'default.jpg';
      const file = new File([blob], filename, { type: blob.type });
      return file; 
    })
    .catch(error => {
      throw error; 
    });
  }
}



