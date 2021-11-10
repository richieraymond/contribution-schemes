import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {LoaderService} from '../../../../app-services/LoaderService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent extends CommonComponent implements OnInit {
    errorMessage: any;
    roles: any;
    userForm: FormGroup;
    private userId: any;
    buttonText: any = 'Create User';
    formErrors = {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        role_id: null,
        company_id: null
    };
    validationMessages = {
        first_name: {
            required: 'First name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        last_name: {
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
        scheme_id: {
            required: 'Company is required'
        }
    };
    display: any = true;
    endPoint = 'scheme/user';
    schemes: any[] = [];

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
            'role_id': [null, [Validators.required]],
            'scheme_id': [null, [Validators.required]]
        });
        this.userId = this.router.snapshot.params.userId;
        if (this.userId) {
            this.buttonText = 'Update Admin';
            this.getUserData(this.userId);
        }
        this.getSchemes();
    }

    private getUserRoles() {
        const controller = this;
        this.sendRequestToServer('scheme/getrolebyscheme/' + this.userForm.controls['scheme_id'].value,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                controller.roles = serverResponse.roles;
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
        if (this.userId) {
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
                    controller.navigateToUsers();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    navigateToUsers() {
        setTimeout(val => {
            this.parentRouter.navigate(['user/users']);
        }, 3000);
    }

    updateUser() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.userId,
            'put',
            JSON.stringify(this.userForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.navigateToUsers();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    private getUserData(userId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + userId,
            'get',
            JSON.stringify(this.userForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.userForm.controls['last_name'].setValue(serverResponse.user.last_name);
                    controller.userForm.controls['scheme_id'].setValue(serverResponse.user.scheme_id);
                    controller.getUserRoles();
                    controller.userForm.controls['email'].setValue(serverResponse.user.email);
                    controller.userForm.controls['phone'].setValue(serverResponse.user.phone);
                    controller.userForm.controls['first_name'].setValue(serverResponse.user.first_name);
                    controller.userForm.controls['role_id'].setValue(serverResponse.user.role_id);
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

    getSchemes() {
        const controller = this;
        this.sendRequestToServer('scheme/scheme',
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.schemes = response.schemes;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }
}
