import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemesRoutingModule} from './schemes-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {AddSchemeComponent} from './components/add-scheme/add-scheme.component';
import {ViewSchemesComponent} from './components/view-schemes/view-schemes.component';
import {SchemeProfileComponent} from './components/scheme-profile/scheme-profile.component';
import { SchemeCategoriesComponent } from './components/scheme-categories/scheme-categories.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AddHierarchyComponent } from './components/add-hierarchy/add-hierarchy.component';
import { AddBranchComponent } from './components/add-branch/add-branch.component';


@NgModule({
    declarations: [
        AddSchemeComponent,
        ViewSchemesComponent,
        SchemeProfileComponent,
        SchemeCategoriesComponent,
        AddCategoryComponent,
        AddHierarchyComponent,
        AddBranchComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        SchemesRoutingModule,
        RippleModule,
        ToastModule
    ]
})
export class SchemesModule {
}
