import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaritalStatusComponent } from './view-marital-status.component';

describe('ViewMaritalStatusComponent', () => {
  let component: ViewMaritalStatusComponent;
  let fixture: ComponentFixture<ViewMaritalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMaritalStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMaritalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
