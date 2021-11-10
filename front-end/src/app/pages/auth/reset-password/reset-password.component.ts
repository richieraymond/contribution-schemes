import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../app-services/CommonService';
import {RemoteHelper} from '../../../app-services/RemoteHelper';
import {LoaderService} from '../../../app-services/LoaderService';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends CommonComponent implements OnInit {
    resetPasswordForm: FormGroup;

    formErrors = {
        token: '',
        password: '',
        confirm_password: ''
    };

    validationMessages = {
        token: {
            required: 'Token is required',
            min: 'Minimum token length is required',
            max: 'Maximum token length is required'
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

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private builder: FormBuilder,
                private cookieService: CookieService,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit() {
        this.resetPasswordForm = this.builder.group({
            'token': [null, [Validators.required, Validators.minLength(6),
                Validators.maxLength(6)]],
            'password': [null, [Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')]],
            'confirm_password': [null, [Validators.required,
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')]],
            'model': [null, [Validators.required]],
            'contact': [null, [Validators.required]]
        });
        this.resetPasswordForm.controls['contact'].setValue(this.commonService.getContact());
        this.resetPasswordForm.controls['model'].setValue(this.commonService.getModel());
    }


    get field() {
        return this.resetPasswordForm.controls;
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
        this.sendRequestToServer('auth/reset',
            'post',
            JSON.stringify(this.resetPasswordForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    setTimeout(val => {
                        if (controller.commonService.getModel() === 'company') {
                            controller.parentRouter.navigate(['/auth/login']);
                        } else {
                            controller.parentRouter.navigate(['/auth/admin']);
                        }
                    }, 3000);
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
}
