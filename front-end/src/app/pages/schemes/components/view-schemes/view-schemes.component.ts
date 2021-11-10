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
    selector: 'app-view-schemes',
    templateUrl: './view-schemes.component.html',
    styleUrls: ['./view-schemes.component.scss']
})
export class ViewSchemesComponent extends CommonComponent implements OnInit {
    cols: any;
    schemes: any = [];
    private endPoint = 'scheme/scheme';

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
            {field: 'name', header: 'Name'},
            {field: 'location', header: 'Location'},
            {field: 'contact_person', header: 'Contact Person'},
            {field: 'phone', header: 'Phone'},
            {field: 'email', header: 'Email'},
            {field: 'actions', header: 'Status'},
        ];
        this.getData();
    }

    getData() {
        const controller = this;
        this.sendRequestToServer(this.endPoint,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.schemes = serverResponse.schemes;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRecord(status: boolean, rowData: any) {
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
                    controller.getData();
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
        this.parentRouter.navigate(['scheme/add-scheme']);
    }

    editRecord(rowData: any) {
        this.parentRouter.navigate(['scheme/edit-scheme', rowData.id]);
    }

    confirmAction(event: Event, status: boolean, rowData: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateRecord(status, rowData);
            }
        });
    }

    viewProfile(rowData) {
        this.parentRouter.navigate(['scheme/scheme-profile', rowData.id]);
    }
}
