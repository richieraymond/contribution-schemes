import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsecurityguardComponent } from './addcontributor.component';

describe('AddsecurityguardComponent', () => {
  let component: AddsecurityguardComponent;
  let fixture: ComponentFixture<AddsecurityguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsecurityguardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsecurityguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
