import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {ViewContributorsComponent} from './components/viewcontributors/viewcontributors.component';
import {AddContributorComponent} from './components/addcontributor/addcontributor.component';
import {ContributorProfileComponent} from './components/contributor-profile/contributor-profile.component';

const routes: Routes = [
    {
        path: 'contributors',
        component: ViewContributorsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Contributors',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-contributor',
        component: AddContributorComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Add Contributor',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-contributor/:contributorId',
        component: AddContributorComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Edit Contributor',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'contributor-profile/:contributorId',
        component: ContributorProfileComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Contributor Profile',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContributorsRoutingModule {
}
