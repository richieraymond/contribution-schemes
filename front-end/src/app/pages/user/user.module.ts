import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {AddUserComponent} from './components/add-user/add-user.component';
import {ViewUsersComponent} from './components/view-users/view-users.component';
import {AddRoleComponent} from './components/add-role/add-role.component';
import {ViewRolesComponent} from './components/view-roles/view-roles.component';
import {ModifyPermissionsComponent} from './components/modify-permissions/modify-permissions.component';
import {ProfileComponent} from './components/profile/profile.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../../shared/shared.module';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { ViewAdminsComponent } from './components/view-admins/view-admins.component';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';

@NgModule({
    declarations: [
        AddUserComponent,
        ViewUsersComponent,
        AddRoleComponent,
        ViewRolesComponent,
        ModifyPermissionsComponent,
        ProfileComponent,
        AddAdminComponent,
        ViewAdminsComponent,
    ],
    imports: [
        CommonModule,
        NgbTabsetModule,
        UserRoutingModule,
        SharedModule,
        TooltipModule,
        RippleModule,
        StyleClassModule
    ]
})
export class UserModule {
}
