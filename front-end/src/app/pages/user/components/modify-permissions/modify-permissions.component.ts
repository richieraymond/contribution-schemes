import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-modify-permissions',
    templateUrl: './modify-permissions.component.html',
    styleUrls: ['./modify-permissions.component.scss']
})
export class ModifyPermissionsComponent extends CommonComponent implements OnInit {
    cols: any;
    users: any;
    permissionForm: FormGroup;
    permissionSource: any[] = [];
    permissionTarget: any[] = [];
    roleId: any;
    permissions: any;
    private apiRoute: string;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private route: ActivatedRoute,
                private builder: FormBuilder,
                private confirmationService: ConfirmationService,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit(): void {
        this.cols = [
            {field: 'vin', header: 'Name'},
            {field: 'vin', header: 'Status'}
        ];
        this.permissionForm = this.builder.group({
            'roleid': [this.roleId, []],
            'permissionid': [null, []]
        });
        this.roleId = this.route.snapshot.params.roleId;
        this.getPermissions(this.roleId);
    }


    private getPermissions(roleId: any) {
        const controller = this;
        this.permissionTarget = [];
        this.permissionSource = [];
        this.sendRequestToServer('auth/permissions/' + roleId,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.permissionSource = serverResponse.allpermissions;
                    const targetPermission: [] = serverResponse.assignedpermissions;
                    if (targetPermission.length > 0) {
                        targetPermission.forEach((val: any) => {
                            if (controller.permissionSource.find(item => item.id === val.permission_id) != null) {
                                const permission = controller.permissionSource.find(item => item.id === val.permission_id);
                                if (val.status) {
                                    controller.permissionSource.splice(controller.permissionSource.indexOf(permission), 1);
                                    controller.permissionTarget.push(permission);
                                }
                            }
                        });
                    }
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRole(permission: any) {
        const controller = this;
        controller.commonService.clearMessage();
        this.sendRequestToServer(this.apiRoute,
            'post',
            {
                'roleid': this.roleId,
                'permissionid': permission
            },
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.getPermissions(controller.roleId);
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

    createUserRole() {
        this.parentRouter.navigate(['user/add-role']);
    }

    redirectToRoles() {
        this.parentRouter.navigate(['user/admin-roles']);
    }

    deletePrivilage(event: any) {
        this.apiRoute = 'auth/revokepermission';
        this.updateRole(event.items[0].id);
    }

    addPrivilage(event: any) {
        this.apiRoute = 'auth/assignpermission';
        this.updateRole(event.items[0].id);
    }

    goToRoles() {
        this.parentRouter.navigate(['user/roles']);
    }
}
