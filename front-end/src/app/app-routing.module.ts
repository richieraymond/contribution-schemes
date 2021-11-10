import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {ContributorComponent} from './layout/contributor/contributor.component';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'dashboard',
        component: AdminComponent,
        loadChildren: () => import('./pages/dashboard//dashboard-default/dashboard-default.module')
            .then(m => m.DashboardDefaultModule)
    },
    {
        path: 'user',
        component: AdminComponent,
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
    },
    {
        path: 'scheme',
        component: AdminComponent,
        loadChildren: () => import('./pages/schemes/schemes.module').then(m => m.SchemesModule)
    },
    {
        path: 'contributor',
        component: AdminComponent,
        loadChildren: () => import('./pages/contributors/contributors.module').then(m => m.ContributorsModule)
    },
    {
        path: 'refdata',
        component: AdminComponent,
        loadChildren: () => import('./pages/reference-data/reference-data.module').then(m => m.ReferenceDataModule)
    },
    {
        path: 'uploads',
        component: AdminComponent,
        loadChildren: () => import('./pages/uploads/uploads.module').then(m => m.UploadsModule)
    },
    {
        path: 'project',
        component: AdminComponent,
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule)
    },
    {
        path: 'contribution',
        component: ContributorComponent,
        loadChildren: () => import('./pages/contributions/contributions.module').then(m => m.ContributionsModule)
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
