import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProjectsRoutingModule} from './projects-routing.module';
import {AddProjectComponent} from './components/add-project/add-project.component';
import {ViewProjectsComponent} from './components/view-projects/view-projects.component';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../../shared/shared.module';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import { ProjectProfileComponent } from './components/project-profile/project-profile.component';


@NgModule({
    declarations: [
        AddProjectComponent,
        ViewProjectsComponent,
        ProjectProfileComponent
    ],
    imports: [
        NgbTabsetModule,
        SharedModule,
        TooltipModule,
        RippleModule,
        StyleClassModule,
        CommonModule,
        ProjectsRoutingModule
    ]
})
export class ProjectsModule {
}
