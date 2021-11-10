import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoggedInGuard} from '../auth/guards/logged-in.guard';
import {UploadGuardsComponent} from './components/upload-guards/upload-guards.component';
import {ViewGuardUploadsComponent} from './components/view-guard-uploads/view-guard-uploads.component';
import {UploadedGuardDetailsComponent} from './components/uploaded-guard-details/uploaded-guard-details.component';
import {UploadRfidCardsComponent} from './components/upload-rfid-cards/upload-rfid-cards.component';
import {UploadedRfidCardBatchesComponent} from './components/uploaded-rfid-card-batches/uploaded-rfid-card-batches.component';
import {UploadedRfidCardDetailsComponent} from './components/uploaded-rfid-card-details/uploaded-rfid-card-details.component';
import {UploadSitesComponent} from './components/upload-sites/upload-sites.component';
import {UploadedSiteBatchesComponent} from './components/uploaded-site-batches/uploaded-site-batches.component';
import {UploadedSiteDetailsComponent} from './components/uploaded-site-details/uploaded-site-details.component';
import {ManageSchemeGuard} from '../auth/guards/manage-scheme.guard';

const routes: Routes = [
    {
        path: 'bulk-upload',
        component: UploadGuardsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Upload',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'view-guards-batches',
        component: ViewGuardUploadsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Upload',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'uploaded-guards/:batchNo',
        component: UploadedGuardDetailsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Upload',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'uploaded-rfid-cards/:batchNo',
        component: UploadedRfidCardDetailsComponent,
        canActivate: [ManageSchemeGuard, LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Upload Cards',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'upload-sites',
        component: UploadSitesComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Upload Sites',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },
    {
        path: 'uploaded-site-batch',
        component: UploadedSiteBatchesComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Uploaded Sites',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },

    {
        path: 'uploaded-sites/:batchNo',
        component: UploadedSiteDetailsComponent,
        canActivate: [LoggedInGuard],
        data: {
            breadcrumb: 'Bulk Uploaded Sites',
            icon: 'icofont-home bg-c-blue',
            status: false
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadsRoutingModule {
}
