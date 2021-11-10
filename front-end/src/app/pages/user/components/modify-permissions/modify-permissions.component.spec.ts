import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPermissionsComponent } from './modify-permissions.component';

describe('ModifyPermissionsComponent', () => {
  let component: ModifyPermissionsComponent;
  let fixture: ComponentFixture<ModifyPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
