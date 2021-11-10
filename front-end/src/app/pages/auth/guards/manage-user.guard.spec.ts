import { TestBed } from '@angular/core/testing';

import { ManageUserGuard } from './manage-user.guard';

describe('ManageUserGuard', () => {
  let guard: ManageUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ManageUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
