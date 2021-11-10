import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeContributionComponent } from './make-contribution.component';

describe('MakeContributionComponent', () => {
  let component: MakeContributionComponent;
  let fixture: ComponentFixture<MakeContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeContributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
