import { TestBed } from '@angular/core/testing';

import { ManageAdminGuard } from './manage-admin.guard';

describe('ManageAdminGuard', () => {
  let guard: ManageAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
