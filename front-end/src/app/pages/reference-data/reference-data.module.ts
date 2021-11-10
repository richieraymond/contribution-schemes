import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReferenceDataRoutingModule} from './reference-data-routing.module';
import {AddTitleComponent} from './components/add-title/add-title.component';
import {ViewTitlesComponent} from './components/view-titles/view-titles.component';
import {AddMaritalStatusComponent} from './components/add-marital-status/add-marital-status.component';
import {ViewMaritalStatusComponent} from './components/view-marital-status/view-marital-status.component';
import {AddEducationLevelComponent} from './components/add-education-level/add-education-level.component';
import {ViewEducationLevelsComponent} from './components/view-education-levels/view-education-levels.component';
import {SharedModule} from '../../shared/shared.module';
import {SchemesRoutingModule} from '../schemes/schemes-routing.module';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';


@NgModule({
    declarations: [
        AddTitleComponent,
        ViewTitlesComponent,
        AddMaritalStatusComponent,
        ViewMaritalStatusComponent,
        AddEducationLevelComponent,
        ViewEducationLevelsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReferenceDataRoutingModule,
        RippleModule,
        ToastModule
    ]
})
export class ReferenceDataModule {
}
