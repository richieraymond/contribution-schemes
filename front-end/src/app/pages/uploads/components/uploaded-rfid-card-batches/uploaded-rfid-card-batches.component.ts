import { Component, OnInit } from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-uploaded-rfid-card-batches',
  templateUrl: './uploaded-rfid-card-batches.component.html',
  styleUrls: ['./uploaded-rfid-card-batches.component.scss']
})
export class UploadedRfidCardBatchesComponent extends CommonComponent implements OnInit {
  uploadedRfidCards: any[] = [];
  cols: any;
  constructor(commonService: CommonService,
              helper: RemoteHelper,
              loaderService: LoaderService,
              parentRouter: Router,
              private builder: FormBuilder,
              private confirmationService: ConfirmationService,
              modalService: NgbModal) {
    super(commonService, helper, loaderService, parentRouter, modalService);
  }

  ngOnInit(): void {
   this.cols = [ {field: 'name', header: 'Batch No'},
    {field: 'name', header: 'Company'},
    {field: 'name', header: 'Created On'},
    {field: 'name', header: 'Status'}, ];
this.getUploads();
  }

    uploadRfidCards() {
        this.parentRouter.navigate(['uploads/uploaded-site-batch']);


    }

  getUploads() {
    const controller = this;
    this.sendRequestToServer('uploads/uploadedRfidCardBatches',
        'get',
        null,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.uploadedRfidCards = serverResponse.batch;
          } else {
            controller.commonService.showError(serverResponse.message);
          }
        }, function (error: any) {
          controller.commonService.showError(error.error.message);
        });

  }
  handleResponse(response: any) {
    return response;

  }

  processApproval(rowData) {
      this.parentRouter.navigate(['uploads/uploaded-rfid-cards', rowData.batch_no]);


  }
}
