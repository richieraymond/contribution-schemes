import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTitlesComponent } from './view-titles.component';

describe('ViewTitlesComponent', () => {
  let component: ViewTitlesComponent;
  let fixture: ComponentFixture<ViewTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
