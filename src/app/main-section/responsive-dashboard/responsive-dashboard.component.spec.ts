import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveDashboardComponent } from './responsive-dashboard.component';

describe('ResponsiveDashboardComponent', () => {
  let component: ResponsiveDashboardComponent;
  let fixture: ComponentFixture<ResponsiveDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsiveDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponsiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
