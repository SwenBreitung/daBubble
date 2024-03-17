import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSendigComponent } from './input-sendig.component';

describe('InputSendigComponent', () => {
  let component: InputSendigComponent;
  let fixture: ComponentFixture<InputSendigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSendigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputSendigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
