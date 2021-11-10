import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MakeContributionComponent} from './components/make-contribution/make-contribution.component';
import {MyContributionsComponent} from './components/my-contributions/my-contributions.component';

const routes: Routes = [
    {
        path: 'make-contribution',
        component: MakeContributionComponent,
    },
    {
        path: 'my-contributions',
        component: MyContributionsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContributionsRoutingModule {
}
