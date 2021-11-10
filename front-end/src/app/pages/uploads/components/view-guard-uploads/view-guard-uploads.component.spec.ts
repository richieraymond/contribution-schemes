import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGuardUploadsComponent } from './view-guard-uploads.component';

describe('ViewGuardUploadsComponent', () => {
  let component: ViewGuardUploadsComponent;
  let fixture: ComponentFixture<ViewGuardUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGuardUploadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGuardUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
