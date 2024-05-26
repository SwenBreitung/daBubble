import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { FormControl } from '@angular/forms';
import { AuthService } from './../../service/auth.service';
import { NoteListService } from './../../service/note-list.service';
import { AllUserService } from './../../service/all-user.service'
import { User } from './../../models/user.class';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: AuthService;
  let noteService: NoteListService;
  let allUserService: AllUserService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // Tests für requiredWithoutSpaces
  it('should return required error if control value is empty or only spaces', () => {
    const control = new FormControl('   ');
    const result = component.requiredWithoutSpaces(control);
    expect(result).toEqual({ required: true });
  });

  it('should return null if control value is not empty and does not consist only of spaces', () => {
    const control = new FormControl('valid input');
    const result = component.requiredWithoutSpaces(control);
    expect(result).toBeNull();
  });

  // Tests für email FormControl
  it('should mark email as invalid if empty', () => {
    component.email.setValue('');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ required: true });
  });

  it('should mark email as invalid if not a valid email address', () => {
    component.email.setValue('invalid-email');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ email: true });
  });

  it('should mark email as valid if it is a valid email address', () => {
    component.email.setValue('valid@example.com');
    expect(component.email.valid).toBeTrue();
    expect(component.email.errors).toBeNull();
  });

  it('should mark the field as touched on blur', () => {
    type FieldName = 'name' | 'email' | 'password' | 'checkbox';
    const fieldNames: FieldName[] = ['name', 'email', 'password', 'checkbox'];
  
    fieldNames.forEach(fieldName => {
      component.onBlur(fieldName);
      expect(component.touched[fieldName]).toBeTrue();
    });
  });

  it('should set errorBooliean to true if field is invalid and dirty', () => {
    const field = { invalid: true, dirty: true, touched: false };
    component.checkFieldValidity(field);
    expect(component.errorBooliean).toBeTrue();
  });

  it('should set errorBooliean to true if field is invalid and touched', () => {
    const field = { invalid: true, dirty: false, touched: true };
    component.checkFieldValidity(field);
    expect(component.errorBooliean).toBeTrue();
  });

  it('should not set errorBooliean to true if field is valid', () => {
    const field = { invalid: false, dirty: true, touched: true };
    component.checkFieldValidity(field);
    expect(component.errorBooliean).toBeFalse();
  });

  it('should not set errorBooliean to true if field is invalid but neither dirty nor touched', () => {
    const field = { invalid: true, dirty: false, touched: false };
    component.checkFieldValidity(field);
    expect(component.errorBooliean).toBeFalse();
  });

  it('should save user and navigate to login if form is valid and current step is 2', fakeAsync(() => {
    const form = { valid: true };
    spyOn(component, 'checkUsername').and.returnValue(Promise.resolve(false));
    spyOn(component, 'checkEmail').and.returnValue(Promise.resolve(false));
    spyOn(component, 'saveUser').and.callThrough();

    component.currentStep = 2;
    component.onSubmit(form);
    tick();

    expect(component.saveUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.errorBooliean).toBeFalse();
  }));

  it('should set errorBooliean to true if form is invalid', fakeAsync(() => {
    const form = { valid: false };
    
    component.onSubmit(form);
    tick();

    expect(component.errorBooliean).toBeTrue();
  }));

  it('should set errorBooliean to true if username or email is invalid', fakeAsync(() => {
    const form = { valid: true };
    spyOn(component, 'checkUsername').and.returnValue(Promise.resolve(true));
    spyOn(component, 'checkEmail').and.returnValue(Promise.resolve(false));

    component.currentStep = 1;
    component.onSubmit(form);
    tick();

    expect(component.errorBooliean).toBeTrue();
  }));


  
  it('should save user and call appropriate service methods', fakeAsync(() => {
    const mockUserCredential = {
      user: { uid: '12345' }
    };
    const mockImagePath = 'path/to/image.jpg';

    (authService.signUp as jasmine.Spy).and.returnValue(Promise.resolve(mockUserCredential));
    spyOn(component, 'uploadSelectedImage').and.returnValue(Promise.resolve(mockImagePath));

    component.saveUser();
    tick();

    expect(authService.signUp).toHaveBeenCalledWith('test@example.com', 'password');
    expect(component.uploadSelectedImage).toHaveBeenCalled();
    expect(noteService.addUser).toHaveBeenCalledWith(jasmine.any(Object), '12345');
    expect(allUserService.addName).toHaveBeenCalledWith('Test User');
    expect(allUserService.addEmail).toHaveBeenCalledWith('test@example.com');
  }));


  
});
