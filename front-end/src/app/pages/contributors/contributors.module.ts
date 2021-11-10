import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContributorsRoutingModule} from './contributors-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import {AddContributorComponent} from './components/addcontributor/addcontributor.component';
import {ContributorProfileComponent} from './components/contributor-profile/contributor-profile.component';
import {ViewContributorsComponent} from './components/viewcontributors/viewcontributors.component';


@NgModule({
    declarations: [
        AddContributorComponent,
        ContributorProfileComponent,
        ViewContributorsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ContributorsRoutingModule,
        RippleModule,
        TooltipModule
    ]
})
export class ContributorsModule {
}
