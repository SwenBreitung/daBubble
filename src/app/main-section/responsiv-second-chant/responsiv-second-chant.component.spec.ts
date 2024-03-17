import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsivSecondChantComponent } from './responsiv-second-chant.component';

describe('ResponsivSecondChantComponent', () => {
  let component: ResponsivSecondChantComponent;
  let fixture: ComponentFixture<ResponsivSecondChantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsivSecondChantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponsivSecondChantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
