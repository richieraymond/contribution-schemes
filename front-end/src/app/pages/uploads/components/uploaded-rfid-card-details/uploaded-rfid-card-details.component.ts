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
  selector: 'app-uploaded-rfid-card-details',
  templateUrl: './uploaded-rfid-card-details.component.html',
  styleUrls: ['./uploaded-rfid-card-details.component.scss']
})
export class UploadedRfidCardDetailsComponent extends CommonComponent implements OnInit {
  selectedRfidCards: any[] = [];
  cols: any;
  batchUplaodedRfidCards: any[] = [];
  isPartiallyProcessed: any = false;
  batchNo: any;
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
    if (this.batchNo) {
      this.getBatchDetails(this.batchNo);
    }
  }
  confirmAction(action: string) {

    if (action === 'process') {

      this.confirmationService.confirm({
        message: 'Are you sure that you want to approve these guards?',
        accept: () => {
          this.approveRfidCards();
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
  getBatchDetails(batchNo: any) {
    const controller = this;
    this.sendRequestToServer('uploads/uploaded-rfid-card-details/' + batchNo,
        'get',
        null,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.batchUplaodedRfidCards = serverResponse.batch_details;
            // console.log( controller.batchUplaodedRfidCards);
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

   approveRfidCards() {
     const controller = this;
     const selectedItems = controller.selectedRfidCards;
     this.sendRequestToServer('uploads/approveRfidCards',
         'post',
         JSON.stringify(selectedItems),
         true,
         function (response: any) {
           const serverResponse = controller.handleResponse(response);
           if (serverResponse.success) {
             controller.commonService.showSuccess(serverResponse.message);
             controller.redirectToRfidBatches();
           } else {
             controller.commonService.showError(serverResponse.message);
           }
         }, function (error: any) {
           controller.commonService.showError(error.error.message);
         });

   }
  redirectToRfidBatches() {
    setTimeout((val: any) => {
      this.parentRouter.navigate(['uploads/view-rfid-batches']);
    }, 2000);
  }

   deleteSelected() {
       const controller = this;
       const selectedItems = controller.selectedRfidCards;
       this.sendRequestToServer('uploads/deleteRfidCards',
           'post',
           JSON.stringify(selectedItems),
           true,
           function (response: any) {
               const serverResponse = controller.handleResponse(response);
               if (serverResponse.success) {
                   controller.commonService.showSuccess(serverResponse.message);
                   controller.redirectToRfidBatches();
               } else {
                   controller.commonService.showError(serverResponse.message);
               }
           }, function (error: any) {
               controller.commonService.showError(error.error.message);
           });

  }
}
