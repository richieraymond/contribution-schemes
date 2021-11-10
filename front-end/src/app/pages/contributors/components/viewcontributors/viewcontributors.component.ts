import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-viewcontributors',
    templateUrl: './viewcontributors.component.html',
    styleUrls: ['./viewcontributors.component.scss']
})
export class ViewContributorsComponent extends CommonComponent implements OnInit {
    cols: any;
    contributors: any = [];
    private endPoint = 'scheme/contributor';

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
        this.cols = [
            {field: 'first_name', header: 'Name'},
            {field: 'email', header: 'Email'},
            {field: 'phone', header: 'Phone'},
            {field: 'status', header: 'Status'}
        ];
        this.getRecords();
    }

    getRecords() {
        const controller = this;
        this.sendRequestToServer(this.endPoint,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.contributors = serverResponse.contributors;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRecord(status: boolean, action: any, rowData: any) {
        const controller = this;
        rowData.status = status;
        this.sendRequestToServer(this.endPoint + '/' + rowData.id,
            'put',
            JSON.stringify(rowData),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.getRecords();
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

    createRecord() {
        this.parentRouter.navigate(['contributor/add-contributor']);
    }

    editRecord(rowData: any) {
        this.parentRouter.navigate(['contributor/edit-contributor', rowData.id]);
    }

    confirmAction(event: Event, status: boolean, action: any, rowData: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateRecord(status, action, rowData);
            }
        });
    }

    naviateToProfile(rowData) {
        this.parentRouter.navigate(['contributor/contributor-profile', rowData.id]);
    }
}
