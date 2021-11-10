import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../app-services/CommonService';
import {RemoteHelper} from '../../../app-services/RemoteHelper';
import {LoaderService} from '../../../app-services/LoaderService';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'app-basic-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent extends CommonComponent implements OnInit {
    logInForm: FormGroup;
    errorMessage: any;
    formErrors = {
        useridentifier: '',
        password: ''
    };

    validationMessages = {
        useridentifier: {
            required: 'Email is required',
            email: 'Enter a valid email address',
        },
        password: {
            required: 'Password is required',
            minLength: 'Password must be at least eight characters long',

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
        this.logInForm = this.builder.group({
            'useridentifier': [null, [Validators.required, Validators.email]],
            'password': [null, [Validators.required, Validators.minLength(8)]],
            'model': ['admin', []],
        });
    }

    get field() {
        return this.logInForm.controls;
    }

    processLogin() {
        const controller = this;
        this.errorMessage = '';
        this.logInForm.markAllAsTouched();
        this.logInForm.updateValueAndValidity();
        if (this.logInForm.invalid) {
            this.logInForm.markAllAsTouched();
            this.validateLogInFrom();
            return;
        }
        this.commonService.removeAll();
        this.sendRequestToServer('auth/login',
            'post',
            JSON.stringify(this.logInForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.user.loggedIn = response.success;
                    controller.user.userData = response.user;
                    controller.user.userRole = response.role;
                    controller.user.token = response.token;
                    controller.user.permissions = response.permissions;
                    controller.commonService.setLoginStatus(true);
                    controller.parentRouter.navigate(['/dashboard/']);
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateLogInFrom() {
        this.validateForm(this.logInForm, this.validationMessages, this.formErrors);
    }
}
