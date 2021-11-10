import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedRfidCardBatchesComponent } from './uploaded-rfid-card-batches.component';

describe('UploadedRfidCardBatchesComponent', () => {
  let component: UploadedRfidCardBatchesComponent;
  let fixture: ComponentFixture<UploadedRfidCardBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedRfidCardBatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedRfidCardBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
