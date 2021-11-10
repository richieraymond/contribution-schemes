import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEducationLevelsComponent } from './view-education-levels.component';

describe('ViewEducationLevelsComponent', () => {
  let component: ViewEducationLevelsComponent;
  let fixture: ComponentFixture<ViewEducationLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEducationLevelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEducationLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
