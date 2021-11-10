import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageSchemeGuard} from '../auth/guards/manage-scheme.guard';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {ViewSchemesComponent} from './components/view-schemes/view-schemes.component';
import {AddSchemeComponent} from './components/add-scheme/add-scheme.component';
import {SchemeProfileComponent} from './components/scheme-profile/scheme-profile.component';
import {SchemeCategoriesComponent} from './components/scheme-categories/scheme-categories.component';
import {AddCategoryComponent} from './components/add-category/add-category.component';
import {AddHierarchyComponent} from './components/add-hierarchy/add-hierarchy.component';
import {AddBranchComponent} from './components/add-branch/add-branch.component';

const routes: Routes = [
    {
        path: 'schemes',
        component: ViewSchemesComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Schemes',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-scheme',
        component: AddSchemeComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Scheme',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-scheme/:schemeId',
        component: AddSchemeComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Company',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'scheme-profile/:schemeId',
        component: SchemeProfileComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Scheme Profile',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },


    {
        path: 'scheme-categories',
        component: SchemeCategoriesComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Scheme Categories',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-scheme-category',
        component: AddCategoryComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Category',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-scheme-category/:categoryId',
        component: AddCategoryComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Category',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-scheme-hierarchy/:schemeId',
        component: AddHierarchyComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Hierarchy',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-scheme-hierarchy/:hierarchyId',
        component: AddHierarchyComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Hierarchy',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },


    {
        path: 'create-branch/:schemeId',
        component: AddBranchComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Add Branch',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-branch/:branchId/:schemeId',
        component: AddBranchComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Edit Branch',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchemesRoutingModule {
}
