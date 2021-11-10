import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSitesComponent } from './upload-sites.component';

describe('UploadSitesComponent', () => {
  let component: UploadSitesComponent;
  let fixture: ComponentFixture<UploadSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
