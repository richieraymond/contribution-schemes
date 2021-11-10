import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedSiteBatchesComponent } from './uploaded-site-batches.component';

describe('UploadedSiteBatchesComponent', () => {
  let component: UploadedSiteBatchesComponent;
  let fixture: ComponentFixture<UploadedSiteBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedSiteBatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedSiteBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
