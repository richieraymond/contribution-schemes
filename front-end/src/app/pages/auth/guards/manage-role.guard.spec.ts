import { TestBed } from '@angular/core/testing';

import { ManageRoleGuard } from './manage-role.guard';

describe('ManageRoleGuard', () => {
  let guard: ManageRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
