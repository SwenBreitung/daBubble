import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassagerComponent } from './massager.component';

describe('MassagerComponent', () => {
  let component: MassagerComponent;
  let fixture: ComponentFixture<MassagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MassagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
