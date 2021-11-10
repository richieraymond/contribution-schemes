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
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends CommonComponent implements OnInit {
    forgotPasswordForm: FormGroup;

    formErrors = {
        phone: '',
        email: ''
    };

    validationMessages = {
        email: {
            required: 'Email is required',
            email: 'Enter a valid email address',
        },
        phone: {
            required: 'Phone is required',
            pattern: 'Enter a valid phone number e.g. 256704655303'
        }
    };
    channelText = 'Use phone number';

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
        this.forgotPasswordForm = this.builder.group({
            'use_phone': [false, []],
            'email': [null, []],
            'phone': [null, []],
            'model': [null, []]
        });
        this.updateValidators();
        this.forgotPasswordForm.controls['model'].setValue(this.commonService.getModel());
    }

    updateValidators() {
        if (this.forgotPasswordForm.controls['use_phone'].value) {
            this.forgotPasswordForm.controls['phone'].setValidators([Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]);
            this.forgotPasswordForm.controls['email'].clearValidators();
            this.forgotPasswordForm.controls['email'].setValue(null);
        } else {
            this.forgotPasswordForm.controls['email'].setValidators([Validators.required, Validators.email]);
            this.forgotPasswordForm.controls['phone'].clearValidators();
            this.forgotPasswordForm.controls['phone'].setValue(null);
        }
        this.forgotPasswordForm.updateValueAndValidity();
    }

    get field() {
        return this.forgotPasswordForm.controls;
    }

    forgotPasswordRequest() {
        const controller = this;
        this.forgotPasswordForm.markAllAsTouched();
        this.forgotPasswordForm.updateValueAndValidity();
        if (this.forgotPasswordForm.invalid) {
            this.forgotPasswordForm.markAllAsTouched();
            this.validateForgotPasswordForm();
            return;
        }
        this.commonService.removeAll();
        this.sendRequestToServer('auth/forgot',
            'post',
            JSON.stringify(this.forgotPasswordForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.commonService.setContact(response.token.contact);
                    setTimeout(val => {
                        controller.parentRouter.navigate(['/auth/reset']);
                    }, 3000);
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateForgotPasswordForm() {
        this.validateForm(this.forgotPasswordForm, this.validationMessages, this.formErrors);
    }
}
