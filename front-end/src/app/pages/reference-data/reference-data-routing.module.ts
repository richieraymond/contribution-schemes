import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageSchemeGuard} from '../auth/guards/manage-scheme.guard';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {ViewMaritalStatusComponent} from './components/view-marital-status/view-marital-status.component';
import {AddMaritalStatusComponent} from './components/add-marital-status/add-marital-status.component';
import {ViewTitlesComponent} from './components/view-titles/view-titles.component';
import {AddTitleComponent} from './components/add-title/add-title.component';
import {ViewEducationLevelsComponent} from './components/view-education-levels/view-education-levels.component';
import {AddEducationLevelComponent} from './components/add-education-level/add-education-level.component';

const routes: Routes = [
    {
        path: 'view-marital-status',
        component: ViewMaritalStatusComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Marital Status',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-marital-status',
        component: AddMaritalStatusComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Marital Status',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-marital-status/:maritalStatusId',
        component: AddMaritalStatusComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Marital Status',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },

    /**
     * Titles
     */
    {
        path: 'view-titles',
        component: ViewTitlesComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Titles',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-title',
        component: AddTitleComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Title',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-title/:titleId',
        component: AddTitleComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Title',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },

    /**
     * Education levels
     */
    {
        path: 'view-education-levels',
        component: ViewEducationLevelsComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Education Levels',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-education-level',
        component: AddEducationLevelComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Education Level',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-education-level/:educationLevelId',
        component: AddEducationLevelComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Education Level',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReferenceDataRoutingModule {
}
