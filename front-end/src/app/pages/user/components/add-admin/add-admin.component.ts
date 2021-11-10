import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-admin',
    templateUrl: './add-admin.component.html',
    styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent extends CommonComponent implements OnInit {
    errorMessage: any;
    roles: any;
    userForm: FormGroup;
    formErrors = {
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        role_id: null,
        branch_id: null
    };
    validationMessages = {
        firstname: {
            required: 'First name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        lastname: {
            required: 'Last name is required'
        },
        phone: {
            required: 'Phone number is required',
            pattern: 'Enter a valid phone number e.g. 256704655303'
        },
        email: {
            email: 'Enter a valid email',
            required: 'Email address is required',
        },
        role_id: {
            required: 'User Role is required'
        },
        branch_id: {
            required: 'Branch is required'
        },
        password: {
            required: 'Password is required',
            pattern: 'Password must contain atleast one number, one character and one special character',
        }
    };
    display: any = true;
    endPoint = 'auth/admin';
    private adminId: any;

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
        this.userForm = this.builder.group({
            'first_name': [null, [Validators.required, Validators.maxLength(50)]],
            'last_name': [null, [Validators.required, Validators.maxLength(50)]],
            'phone': [null, [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': [null, [Validators.required, Validators.email]],
            'role_id': [null, [Validators.required]]
        });
        this.adminId = this.router.snapshot.params.adminId;
        if (this.adminId) {
            this.getUserData(this.adminId);
        }
        this.getAdminRoles();
    }

    private getAdminRoles() {
        const controller = this;
        this.sendRequestToServer('auth/roles',
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                controller.roles = serverResponse.roles;
                console.log(controller.roles);
            }, function (error: any) {
                controller.errorMessage = error.error.message;
            });
    }

    handleResponse(response: any) {
        return response;
    }

    addUser() {
        const controller = this;
        this.userForm.markAllAsTouched();
        this.validateUserForm();
        if (this.userForm.invalid) {
            return;
        }
        if (this.adminId) {
            this.updateUser();
            return;
        }
        this.sendRequestToServer(this.endPoint,
            'post',
            JSON.stringify(this.userForm.value),
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

    updateUser() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.adminId,
            'put',
            JSON.stringify(this.userForm.value),
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

    redirectToAdmins() {
        setTimeout((val: any) => {
            this.parentRouter.navigate(['user/admins']);
        }, 2000);
    }

    private getUserData(adminId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + adminId,
            'get',
            JSON.stringify(this.userForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.userForm.controls['first_name'].setValue(serverResponse.admin.first_name);
                    controller.userForm.controls['last_name'].setValue(serverResponse.admin.last_name);
                    controller.userForm.controls['email'].setValue(serverResponse.admin.email);
                    controller.userForm.controls['phone'].setValue(serverResponse.admin.phone);
                    controller.userForm.controls['role_id'].setValue(serverResponse.admin.role_id);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateUserForm() {
        this.validateForm(this.userForm, this.validationMessages, this.formErrors);
    }
}
