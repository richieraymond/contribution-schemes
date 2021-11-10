import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent extends CommonComponent implements OnInit {
    schemes: any[] = [];
    roleForm: FormGroup;
    formErrors = {
        name: '',
        company_id: ''
    };
    validationMessages = {
        name: {
            required: 'Role name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        }
    };
    display: any = true;
    endPoint = 'auth/roles';
    private roleId: any;
    checked = false;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit(): void {
        this.roleForm = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'is_admin_role': [false, [Validators.required]],
            'scheme_id': [null, []],
        });
        this.roleId = this.router.snapshot.params.roleId;
        this.getSchemes();
        if (this.roleId) {
            this.getRoleData(this.roleId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    addRole() {
        const controller = this;
        this.roleForm.markAllAsTouched();
        this.validateRoleForm();
        if (this.roleForm.invalid) {
            return;
        }
        if (this.roleId) {
            this.updateRole();
            return;
        }
        this.sendRequestToServer(this.endPoint,
            'post',
            JSON.stringify(this.roleForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.redirectToAdmins();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRole() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.roleId,
            'put',
            JSON.stringify(this.roleForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.redirectToAdmins();
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirectToAdmins() {
        setTimeout((val: any) => {
            this.parentRouter.navigate(['user/roles']);
        }, 2000);
    }

    private getRoleData(adminId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + adminId,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                console.log(serverResponse);
                if (serverResponse.success) {
                    controller.roleForm.controls['name'].setValue(serverResponse.role.name);
                    controller.roleForm.controls['is_admin_role'].setValue(serverResponse.role.is_admin_role);
                    controller.roleForm.controls['scheme_id'].setValue(serverResponse.role.scheme_id);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateRoleForm() {
        this.validateForm(this.roleForm, this.validationMessages, this.formErrors);
    }

    getSchemes() {
        const controller = this;
        this.sendRequestToServer('scheme/scheme',
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
}
