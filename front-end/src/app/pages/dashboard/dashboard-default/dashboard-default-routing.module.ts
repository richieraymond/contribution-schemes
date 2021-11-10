import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardDefaultComponent} from './dashboard-default.component';
import {LoggedInGuard} from '../../auth/guards/logged-in.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardDefaultComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Default',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardDefaultRoutingModule {
}
