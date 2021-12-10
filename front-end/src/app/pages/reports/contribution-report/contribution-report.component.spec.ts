import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionReportComponent } from './contribution-report.component';

describe('ContributionReportComponent', () => {
  let component: ContributionReportComponent;
  let fixture: ComponentFixture<ContributionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
