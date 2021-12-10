import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {MemberReportComponent} from './member-report/member-report.component';
import {ContributionReportComponent} from './contribution-report/contribution-report.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [
        MemberReportComponent,
        ContributionReportComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        ReportsRoutingModule
    ]
})
export class ReportsModule {
}
