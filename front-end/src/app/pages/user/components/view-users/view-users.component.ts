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
    selector: 'app-view-users',
    templateUrl: './view-users.component.html',
    styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent extends CommonComponent implements OnInit {
    cols: any;
    users: any = [];
    private endPoint = 'scheme/user';

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
            {field: 'first_name', header: 'Name', options: {concatfields: true, fields: ['last_name']}},
            {field: 'email', header: 'Email', options: {}},
            {field: 'phone', header: 'Phone', options: {}},
            {field: 'role.name', header: 'Role', options: {}},
            {field: 'company.name', header: 'Company', options: {}},
            {field: 'status', header: 'Status'}
        ];
        this.getUsers();
    }

    getUsers() {
        const controller = this;
        this.sendRequestToServer(this.endPoint,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.users = serverResponse.users;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateUser(status: boolean, rowData: any) {
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
                    controller.getUsers();
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

    createUser() {
        this.parentRouter.navigate(['user/add-user']);
    }

    editUser(rowData: any) {
        this.parentRouter.navigate(['user/edit-user', rowData.id]);
    }

    confirmAction(event: Event, status: boolean, rowData: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateUser(status, rowData);
            }
        });
    }
}
