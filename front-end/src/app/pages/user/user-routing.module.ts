import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewUsersComponent} from './components/view-users/view-users.component';
import {AddUserComponent} from './components/add-user/add-user.component';
import {ViewRolesComponent} from './components/view-roles/view-roles.component';
import {AddRoleComponent} from './components/add-role/add-role.component';
import {ViewAdminsComponent} from './components/view-admins/view-admins.component';
import {AddAdminComponent} from './components/add-admin/add-admin.component';
import {ModifyPermissionsComponent} from './components/modify-permissions/modify-permissions.component';
import {ManageAdminGuard} from '../auth/guards/manage-admin.guard';
import {ManageUserGuard} from '../auth/guards/manage-user.guard';
import {ManageRoleGuard} from '../auth/guards/manage-role.guard';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {ProfileComponent, UserProfile} from './components/profile/profile.component';

const routes: Routes = [
    {
        path: 'admins',
        component: ViewAdminsComponent,
        canActivate: [ManageAdminGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Admins',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-admin',
        component: AddAdminComponent,
        canActivate: [ManageAdminGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Admin',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-admin/:adminId',
        component: AddAdminComponent,
        canActivate: [ManageAdminGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Admin',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'users',
        component: ViewUsersComponent,
        canActivate: [ManageUserGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Users',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [ManageUserGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add User',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-user/:userId',
        component: AddUserComponent,
        canActivate: [ManageUserGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit User',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'roles',
        component: ViewRolesComponent,
        canActivate: [ManageRoleGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Roles',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-role',
        component: AddRoleComponent,
        canActivate: [ManageRoleGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Role',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-role/:roleId',
        component: AddRoleComponent,
        canActivate: [ManageRoleGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Role',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'modify-permissions/:roleId',
        component: ModifyPermissionsComponent,
        canActivate: [ManageRoleGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Role',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'My Profile',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
