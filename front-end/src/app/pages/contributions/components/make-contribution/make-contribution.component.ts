import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-make-contribution',
    templateUrl: './make-contribution.component.html',
    styleUrls: ['./make-contribution.component.scss']
})

export class MakeContributionComponent extends CommonComponent implements OnInit {
    schemes: any[] = [];
    formErrors = {
        name: '',
        scheme_id: '',
        phone: '',
        first_name: '',
        last_name: '',
        email: '',
        project_id: '',
        branch_id: '',
        amount: '',
        payment_channel: ''
    };
    validationMessages = {
        name: {
            required: 'Name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        phone: {
            required: 'Phone number is required',
            pattern: 'Enter a valid phone number e.g. 256704655303'
        },
        first_name: {
            required: 'First name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        last_name: {
            required: 'Last name is required'
        },
        email: {
            email: 'Enter a valid email',
            required: 'Email address is required',
        },
        scheme_id: {
            required: 'Scheme is required',
        },
        project_id: {
            required: 'Project is required',
        },
        branch_id: {
            required: 'Branch is required',
        },
        amount: {
            required: 'Amount is required',
            min: 'Minimum amount is UGX. 500',
        },
        payment_channel: {
            required: 'Payment channel is required',
        },
    };
    display: any = true;
    endPoint = 'auth/roles';
    checked = false;
    phoneNumberFormGroup: FormGroup;
    showRegisterContributor = false;
    registerContributorForm: FormGroup;
    showPaymentForm = false;
    branches: any[] = [];
    projects: any[] = [];
    makePaymentForm: FormGroup;
    selectedProject: any = {};
    private selectedScheme: any = {};
    private userPhone: any = '';
    showSummary = false;
    transactionSummary: any = {};

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
        this.phoneNumberFormGroup = this.builder.group({
            'phone': [null, [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]]
        });

        this.registerContributorForm = this.builder.group({
            'first_name': [null, [Validators.required, Validators.maxLength(50)]],
            'last_name': [null, [Validators.required, Validators.maxLength(50)]],
            'phone': [this.phoneNumberFormGroup.controls['phone'].value, [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': ['', [Validators.email]],
        });

        this.makePaymentForm = this.builder.group({
            'scheme_id': [null, [Validators.required]],
            'branch_id': [null, []],
            'project_id': [null, [Validators.required]],
            'amount': [null, [Validators.required, Validators.min(500)]],
            'payment_channel': [null, [Validators.required]],
            'payer_phone': [this.userPhone, []],
            'contributor_id': [this.userPhone, []],
        });
    }

    handleResponse(response: any) {
        return response;
    }

    validateTelForm() {
        this.validateForm(this.phoneNumberFormGroup, this.validationMessages, this.formErrors);
    }

    validateContributorForm() {
        this.validateForm(this.registerContributorForm, this.validationMessages, this.formErrors);
    }

    validatePaymentForm() {
        this.validateForm(this.makePaymentForm, this.validationMessages, this.formErrors);
    }

    getSchemes(event) {
        this.schemes = [];
        const searchTerm = event?.filter;
        if (searchTerm == null || searchTerm.length < 3) {
            return;
        }
        const controller = this;
        this.sendRequestToServer('contribution/get-scheme-by-name/' + searchTerm,
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

    getProjects(event) {
        const controller = this;
        this.sendRequestToServer('contribution/get-projects/' + event,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.projects = serverResponse.projects;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    getBranches(event) {
        const controller = this;
        this.selectedScheme = this.schemes.find(val => val.id === event);
        this.sendRequestToServer('contribution/get-branches/' + event,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.branches = serverResponse.branches;
                    if (controller.branches.length > 1) {
                        controller.makePaymentForm.controls['branch_id'].setValidators([Validators.required]);
                        controller.makePaymentForm.controls['branch_id'].updateValueAndValidity();
                    } else {
                        if (controller.branches.length === 1) {
                            controller.makePaymentForm.controls['branch_id'].setValue(controller.branches[0].id);
                        } else {
                            controller.makePaymentForm.controls['branch_id'].clearValidators();
                        }
                    }
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }


    verifyContributor() {
        const controller = this;
        const phoneNumber = this.phoneNumberFormGroup.controls['phone'].value;
        this.sendRequestToServer('contribution/verify-contributor/' +
            phoneNumber,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    if (!response.contributor) {
                        controller.showRegisterContributor = true;
                        controller.showPaymentForm = false;
                        controller.registerContributorForm.controls['phone'].setValue(phoneNumber);
                    } else {
                        controller.showRegisterContributor = false;
                        controller.showPaymentForm = true;
                        controller.userPhone = response?.contributor?.phone;
                        controller.makePaymentForm.controls['contributor_id'].setValue(response?.contributor?.id);
                    }
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    registerContributor() {
        const controller = this;
        this.registerContributorForm.markAllAsTouched();
        this.validateContributorForm();
        if (this.registerContributorForm.invalid) {
            return;
        }
        this.sendRequestToServer('contribution/register-contributor',
            'post',
            JSON.stringify(this.registerContributorForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.showRegisterContributor = false;
                    controller.userPhone = controller.registerContributorForm.controls['phone'].value;
                    controller.showPaymentForm = true;
                    controller.makePaymentForm.controls['contributor_id'].setValue(response?.contributor?.id);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    changePhoneValidators() {
        if (this.makePaymentForm.controls['payment_channel'].value === 'MOMO') {
            this.makePaymentForm.controls['payer_phone'].setValidators([Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]);
            this.makePaymentForm.controls['payer_phone'].updateValueAndValidity();
        } else {
            this.makePaymentForm.controls['payer_phone'].clearValidators();
        }
        this.makePaymentForm.controls['payer_phone'].setValue(this.userPhone);
    }

    makePayment() {
        const controller = this;
        this.makePaymentForm.markAllAsTouched();
        this.validateContributorForm();
        if (this.makePaymentForm.invalid) {
            return;
        
        }
        this.sendRequestToServer('contribution/make-payment',
            'post',
            JSON.stringify(this.makePaymentForm.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.showPaymentForm = false;
                    controller.showSummary = true;
                    controller.transactionSummary = response?.contribution;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirectToVantageSite() {
        window.location.href = 'https://vantage.co.ug/user-guide.php';
    }

    setSelectedProject(value: any) {
        this.selectedProject = this.projects.find(val => val.id === value);
        if (this.selectedProject.require_fixed_amounts) {
            this.makePaymentForm.controls['amount'].setValue(this?.selectedProject?.amount);
        }
    }
}
