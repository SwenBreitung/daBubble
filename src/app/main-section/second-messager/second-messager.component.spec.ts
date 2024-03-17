import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondMessagerComponent } from './second-messager.component';

describe('SecondMessagerComponent', () => {
  let component: SecondMessagerComponent;
  let fixture: ComponentFixture<SecondMessagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondMessagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecondMessagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
