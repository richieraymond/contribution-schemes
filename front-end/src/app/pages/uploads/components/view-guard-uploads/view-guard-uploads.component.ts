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
  selector: 'app-view-guard-uploads',
  templateUrl: './view-guard-uploads.component.html',
  styleUrls: ['./view-guard-uploads.component.scss']
})
export class ViewGuardUploadsComponent  extends CommonComponent implements OnInit {
cols: any[] = [];
  uploadedGuards: any[] = [];
  private endPoint = 'uploads/uploadedGuards';
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

    this.getUploads();

  }
  getUploads() {
    const controller = this;
    this.sendRequestToServer(this.endPoint,
        'get',
        null,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.uploadedGuards = serverResponse.batch;

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

  uploadGuard() {
    this.parentRouter.navigate(['uploads/bulk-upload']);

  }



  downloadPdf(cols: any, uploadedGuards: any[], uploads: string) {

  }

    processApproval(rowData) {

      this.parentRouter.navigate(['uploads/uploaded-guards', rowData.batch_no]);

    }
}
