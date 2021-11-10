import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRfidCardsComponent } from './upload-rfid-cards.component';

describe('UploadRfidCardsComponent', () => {
  let component: UploadRfidCardsComponent;
  let fixture: ComponentFixture<UploadRfidCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadRfidCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRfidCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
