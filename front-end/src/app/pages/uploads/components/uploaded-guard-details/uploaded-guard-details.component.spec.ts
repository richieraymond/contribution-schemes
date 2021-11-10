import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedGuardDetailsComponent } from './uploaded-guard-details.component';

describe('UploadedGuardDetailsComponent', () => {
  let component: UploadedGuardDetailsComponent;
  let fixture: ComponentFixture<UploadedGuardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedGuardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedGuardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
