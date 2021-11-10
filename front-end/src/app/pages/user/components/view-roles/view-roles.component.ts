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
    selector: 'app-view-roles',
    templateUrl: './view-roles.component.html',
    styleUrls: ['./view-roles.component.scss']
})
export class ViewRolesComponent extends CommonComponent implements OnInit {
    cols: any;
    roles: any = [];
    private endPoint = 'auth/roles';

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
            {field: 'company', header: 'Company'},
            {field: 'status', header: 'Status'}
        ];
        this.getRoles();
    }

    getRoles() {
        const controller = this;
        this.sendRequestToServer(this.endPoint,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.roles = serverResponse.roles;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRole(status: boolean, rowData: any) {
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
                    controller.getRoles();
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

    createRole() {
        this.parentRouter.navigate(['user/add-role']);
    }

    editRole(rowData: any) {
        this.parentRouter.navigate(['user/edit-role', rowData.id]);
    }

    confirmAction(event: Event, status: boolean, rowData: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateRole(status, rowData);
            }
        });
    }
}
