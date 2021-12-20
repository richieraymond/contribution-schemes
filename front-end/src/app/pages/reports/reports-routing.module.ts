import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageAdminGuard} from '../auth/guards/manage-admin.guard';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {MemberReportComponent} from './member-report/member-report.component';
import {ManageUserGuard} from '../auth/guards/manage-user.guard';
import {ContributionReportComponent} from './contribution-report/contribution-report.component';

const routes: Routes = [
    {
        path: 'contributors-report',
        component: MemberReportComponent,
        data: {
            breadcrumb: 'Contributors Report',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'contributions-report',
        component: ContributionReportComponent,
        data: {
            breadcrumb: 'Contributions Report',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule {
}
