import { Component, OnInit } from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-uploaded-guard-details',
  templateUrl: './uploaded-guard-details.component.html',
  styleUrls: ['./uploaded-guard-details.component.scss']
})
export class UploadedGuardDetailsComponent extends CommonComponent implements OnInit {
  selectedGuards: any[] = [];
  batchUplaodedGuards: any[] = [];
  cols: any;
  isPartiallyProcessed: any = false;
  batchNo: any;
  endPoint: any = 'uploads/uploadedGuardDetails/';
  constructor(commonService: CommonService,
              helper: RemoteHelper,
              loaderService: LoaderService,
              parentRouter: Router,
              private router: ActivatedRoute,
              private builder: FormBuilder,
              private confirmationService: ConfirmationService,
              modalService: NgbModal) {
    super(commonService, helper, loaderService, parentRouter, modalService);
  }

  ngOnInit(): void {
    this.batchNo = this.router.snapshot.params.batchNo;

    this.cols = [
      {field: 'name', header: 'First Name'},
      {field: 'name', header: 'Last Name'},
      {field: 'name', header: 'Created On'},
      {field: 'name', header: 'Status'},

    ];
    if (this.batchNo) {
      this.getBatchDetails(this.batchNo);
    }

  }

  getBatchDetails(batchNo: any) {
    const controller = this;
    this.sendRequestToServer(this.endPoint + batchNo,
        'get',
        null,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.batchUplaodedGuards = serverResponse.batch_details;
            console.log( controller.batchUplaodedGuards);
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

  confirmAction(action: string) {

    if (action === 'process') {

      this.confirmationService.confirm({
        message: 'Are you sure that you want to approve these guards?',
        accept: () => {
         this.approveGuards();
        }
      });
    }
    if (action === 'delete') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete these guards?',
        accept: () => {
          this.deleteSelected();
        }
      });
    }

  }

   approveGuards() {
     const controller = this;
     const selectedItems = controller.selectedGuards;
     console.log(selectedItems);
     this.sendRequestToServer('uploads/approveGuards',
         'post',
         JSON.stringify(selectedItems),
         true,
         function (response: any) {
           const serverResponse = controller.handleResponse(response);
           if (serverResponse.success) {
             controller.commonService.showSuccess(serverResponse.message);
             controller.redirectToGuardBatch();
           } else {
             controller.commonService.showError(serverResponse.message);
           }
         }, function (error: any) {
           controller.commonService.showError(error.error.message);
         });

  }
  redirectToGuardBatch() {
    setTimeout((val: any) => {
      this.parentRouter.navigate(['uploads/view-guards-batches']);
    }, 2000);
  }

   deleteSelected() {
     const controller = this;
     const selectedItems = controller.selectedGuards;
     this.sendRequestToServer('uploads/deleteGuards',
         'post',
         JSON.stringify(selectedItems),
         true,
         function (response: any) {
           const serverResponse = controller.handleResponse(response);
           if (serverResponse.success) {
             controller.commonService.showSuccess(serverResponse.message);
             controller.redirectToGuardBatch();
           } else {
             controller.commonService.showError(serverResponse.message);
           }
         }, function (error: any) {
           controller.commonService.showError(error.error.message);
         });

  }
}
