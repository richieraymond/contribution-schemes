import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class UserProfile {
    name: string;
    position: string;
    office: string;
    age: number;
    date: any;
    salary: string;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: [
        trigger('fadeInOutTranslate', [
            transition(':enter', [
                style({opacity: 0}),
                animate('400ms ease-in-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translate(0)'}),
                animate('400ms ease-in-out', style({opacity: 0}))
            ])
        ])
    ]
})
export class ProfileComponent extends CommonComponent implements OnInit {
    formErrors = {
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        role_id: '',
        branch_id: '',
        password: '',
        confirm_password: ''
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
            pattern: 'Invalid password (At least 8 characters lon Mixture of upper and lower case and digits)'
        },
        confirm_password: {
            required: 'Confirm password is required',
            pattern: 'Invalid password (At least 8 characters lon Mixture of upper and lower case and digits)'
        }
    };

    userForm: FormGroup;
    resetPasswordForm: FormGroup;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }


    ngOnInit() {
        this.userForm = this.builder.group({
            'first_name': [this.user.userData.first_name, [Validators.required, Validators.maxLength(50)]],
            'last_name': [this.user.userData.last_name, [Validators.required, Validators.maxLength(50)]],
            'phone': [this.user.userData.phone, [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': [this.user.userData.email, [Validators.required, Validators.email]],
            'role_id': [this.user.userData.role_id],
        });

        this.resetPasswordForm = this.builder.group({
            'password': [null, [Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')]],
            'confirm_password': [null, [Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')]]
        });
    }

    validateUserForm() {
        this.validateForm(this.userForm, this.validationMessages, this.formErrors);
    }

    updateProfile() {
        const controller = this;
        this.userForm.markAllAsTouched();
        this.validateUserForm();
        if (this.userForm.invalid) {
            return;
        }
        let endPoint = 'scheme/user/';
        if (!this.user.userData.scheme_id) {
            endPoint = 'auth/admin/';
        }
        this.sendRequestToServer(endPoint + this.user.userData.id,
            'put',
            JSON.stringify(this.userForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess('Profile updated successfully');
                    if (controller.user.userData.scheme_id) {
                        controller.commonService.updateCookieElement('userData', response.user, 'loggedInUser');
                    } else {
                        controller.commonService.updateCookieElement('userData', response.admin, 'loggedInUser');
                    }
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateResetPasswordForm() {
        this.validateForm(this.resetPasswordForm, this.validationMessages, this.formErrors);
    }

    comparePasswords() {
        this.commonService.clearMessage();
        if (this.resetPasswordForm.controls['password'].value !== this.resetPasswordForm.controls['confirm_password'].value) {
            this.commonService.showError('Passwords do not match');
            return false;
        }
        return true;
    }

    forgotPasswordRequest() {
        const controller = this;
        this.resetPasswordForm.markAllAsTouched();
        this.resetPasswordForm.updateValueAndValidity();
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            this.validateResetPasswordForm();
            return;
        }
        if (!this.comparePasswords()) {
            return;
        }

        this.commonService.removeAll();
        this.sendRequestToServer('auth/profile-reset',
            'post',
            JSON.stringify(this.resetPasswordForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.resetPasswordForm.reset();
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }


}
