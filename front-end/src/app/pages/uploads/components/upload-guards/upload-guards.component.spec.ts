import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGuardsComponent } from './upload-guards.component';

describe('UploadGuardsComponent', () => {
  let component: UploadGuardsComponent;
  let fixture: ComponentFixture<UploadGuardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadGuardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
