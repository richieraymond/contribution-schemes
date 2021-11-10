import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCategoriesComponent } from './scheme-categories.component';

describe('SchemeCategoriesComponent', () => {
  let component: SchemeCategoriesComponent;
  let fixture: ComponentFixture<SchemeCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
