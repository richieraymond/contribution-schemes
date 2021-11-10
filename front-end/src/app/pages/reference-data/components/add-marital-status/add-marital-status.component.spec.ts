import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaritalStatusComponent } from './add-marital-status.component';

describe('AddMaritalStatusComponent', () => {
  let component: AddMaritalStatusComponent;
  let fixture: ComponentFixture<AddMaritalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaritalStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaritalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
