import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {ViewProjectsComponent} from './components/view-projects/view-projects.component';
import {AddProjectComponent} from './components/add-project/add-project.component';
import {ProjectProfileComponent} from './components/project-profile/project-profile.component';


const routes: Routes = [
    {
        path: 'projects',
        component: ViewProjectsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Contributors',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'add-project',
        component: AddProjectComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Add Project',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'edit-project/:projectId',
        component: AddProjectComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Edit Contributor',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'project-profile/:projectId',
        component: ProjectProfileComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Project Profile',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
