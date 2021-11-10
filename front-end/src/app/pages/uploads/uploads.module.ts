import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadsRoutingModule } from './uploads-routing.module';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {SharedModule} from '../../shared/shared.module';
import {UploadRfidCardsComponent} from './components/upload-rfid-cards/upload-rfid-cards.component';
import { UploadGuardsComponent } from './components/upload-guards/upload-guards.component';
import {ViewGuardUploadsComponent} from './components/view-guard-uploads/view-guard-uploads.component';
import {UploadedGuardDetailsComponent} from './components/uploaded-guard-details/uploaded-guard-details.component';
import {UploadedRfidCardBatchesComponent} from './components/uploaded-rfid-card-batches/uploaded-rfid-card-batches.component';
import {UploadedRfidCardDetailsComponent} from './components/uploaded-rfid-card-details/uploaded-rfid-card-details.component';
import {UploadSitesComponent} from './components/upload-sites/upload-sites.component';
import {UploadedSiteBatchesComponent} from './components/uploaded-site-batches/uploaded-site-batches.component';
import {UploadedSiteDetailsComponent} from './components/uploaded-site-details/uploaded-site-details.component';

@NgModule({
  declarations: [
    UploadRfidCardsComponent,
    UploadGuardsComponent,
    ViewGuardUploadsComponent,
    UploadedGuardDetailsComponent,
    UploadedRfidCardBatchesComponent,
      UploadedRfidCardBatchesComponent,
    UploadedRfidCardDetailsComponent,
    UploadSitesComponent,
    UploadedSiteBatchesComponent,
    UploadedSiteDetailsComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    UploadsRoutingModule,
    RippleModule,
    ToastModule

  ]
})
export class UploadsModule { }
