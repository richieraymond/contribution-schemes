import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityguardsComponent } from './viewcontributors.component';

describe('SecurityguardsComponent', () => {
  let component: SecurityguardsComponent;
  let fixture: ComponentFixture<SecurityguardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityguardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityguardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
