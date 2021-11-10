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
  selector: 'app-uploaded-site-batches',
  templateUrl: './uploaded-site-batches.component.html',
  styleUrls: ['./uploaded-site-batches.component.scss']
})
export class UploadedSiteBatchesComponent extends CommonComponent implements OnInit {
cols: any;
  uploadedSitesBatches: any[] = [];
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

    uploadSites() {
        this.parentRouter.navigate(['uploads/upload-sites']);
  }

  getUploads() {
    const controller = this;
    this.sendRequestToServer('uploads/uploadedSiteBatches',
        'get',
        null,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.uploadedSitesBatches = serverResponse.batch;
          } else {
            controller.commonService.showError(serverResponse.message);
          }
        }, function (error: any) {
          controller.commonService.showError(error.error.message);
        });

  }
  handleResponse(response: any) {
      console.log(response);
    return response;

  }

  processApproval(rowData) {
      this.parentRouter.navigate(['uploads/uploaded-sites', rowData.batch_no]);


  }
}
