import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedSiteDetailsComponent } from './uploaded-site-details.component';

describe('UploadedSiteDetailsComponent', () => {
  let component: UploadedSiteDetailsComponent;
  let fixture: ComponentFixture<UploadedSiteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedSiteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedSiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
