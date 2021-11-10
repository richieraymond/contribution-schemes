import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaurdProfileComponent } from './contributor-profile.component';

describe('GaurdProfileComponent', () => {
  let component: GaurdProfileComponent;
  let fixture: ComponentFixture<GaurdProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaurdProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaurdProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
