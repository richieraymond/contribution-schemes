import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContributionsRoutingModule} from './contributions-routing.module';
import {MakeContributionComponent} from './components/make-contribution/make-contribution.component';
import {MyContributionsComponent} from './components/my-contributions/my-contributions.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../../shared/shared.module';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';


@NgModule({
    declarations: [
        MakeContributionComponent,
        MyContributionsComponent
    ],
    imports: [
        CommonModule,
        ContributionsRoutingModule,
        NgbTabsetModule,
        SharedModule,
        TooltipModule,
        RippleModule,
        StyleClassModule,
        CommonModule,
    ]
})
export class ContributionsModule {
}
