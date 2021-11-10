import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedRfidCardDetailsComponent } from './uploaded-rfid-card-details.component';

describe('UploadedRfidCardDetailsComponent', () => {
  let component: UploadedRfidCardDetailsComponent;
  let fixture: ComponentFixture<UploadedRfidCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedRfidCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedRfidCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
