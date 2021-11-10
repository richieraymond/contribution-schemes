import { TestBed } from '@angular/core/testing';

import { ManageCompanyGuard } from './manage-scheme.guard';

describe('ManageCompanyGuard', () => {
  let guard: ManageCompanyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageCompanyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
