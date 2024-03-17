import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsivMainChatComponent } from './responsiv-main-chat.component';

describe('ResponsivMainChatComponent', () => {
  let component: ResponsivMainChatComponent;
  let fixture: ComponentFixture<ResponsivMainChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsivMainChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponsivMainChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
