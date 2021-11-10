import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent extends CommonComponent implements OnInit {
    schemes: any[] = [];
    form: FormGroup;
    formErrors = {
        name: '',
        frequency_unit: '',
        frequency: '',
        amount: '',
        penalty_when_missed: ''
    };
    validationMessages = {
        name: {
            required: 'Project name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        frequency: {
            required: 'Frequency is required',
            min: 'Frequency can not be less than 1'
        },
        frequency_unit: {
            required: 'Project name is required',
        },
        amount: {
            required: 'Amount is required',
            min: 'Amount must be greater than 0'
        }
    };
    display: any = true;
    endPoint = 'scheme/project';
    private projectId: any;
    checked = false;
    frequencies = [
        {name: 'Day', value: 'Day(s)'},
        {name: 'Month', value: 'Month(s)'},
        {name: 'Week', value: 'Week(s)'},
        {name: 'Year', value: 'Year(s)'}
    ];

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
        this.form = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'is_recurring': [false, [Validators.required]],
            'frequency': [null, []],
            'frequency_unit': [null, []],
            'require_fixed_amounts': [false, [Validators.required]],
            'allow_installments': [null, []],
            'amount': [0, []],
            'penalty_when_missed': [0, []],
        });
        this.projectId = this.router.snapshot.params.projectId;
        if (this.projectId) {
            this.getData(this.projectId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    addRole() {
        const controller = this;
        this.form.markAllAsTouched();
        this.validateCurrentForm();
        if (this.form.invalid) {
            return;
        }
        if (this.projectId) {
            this.updateRecord();
            return;
        }
        this.sendRequestToServer(this.endPoint,
            'post',
            JSON.stringify(this.form.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.redirect();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRecord() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.projectId,
            'put',
            JSON.stringify(this.form.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.redirect();
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirect() {
        setTimeout((val: any) => {
            this.parentRouter.navigate(['project/projects']);
        }, 2000);
    }

    private getData(recordId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + recordId,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.form.controls['name'].setValue(serverResponse.project.name);
                    controller.form.controls['is_recurring'].setValue(serverResponse.project.is_recurring);
                    controller.form.controls['frequency'].setValue(serverResponse.project.frequency);
                    controller.form.controls['frequency_unit'].setValue(serverResponse.project.frequency_unit);
                    controller.form.controls['require_fixed_amounts'].setValue(serverResponse.project.require_fixed_amounts);
                    controller.form.controls['allow_installments'].setValue(serverResponse.project.allow_installments);
                    controller.form.controls['amount'].setValue(serverResponse.project.amount);
                    controller.form.controls['penalty_when_missed'].setValue(serverResponse.project.penalty_when_missed);

                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateCurrentForm() {
        this.validateForm(this.form, this.validationMessages, this.formErrors);
    }

    handleRecurringResponse(event) {
        if (event) {
            this.form.controls['frequency'].setValidators([Validators.required, Validators.min(1)]);
            this.form.controls['frequency_unit'].setValidators([Validators.required]);
        } else {
            this.form.controls['frequency'].clearValidators();
            this.form.controls['frequency_unit'].clearValidators();
        }
        this.form.controls['frequency'].updateValueAndValidity();
        this.form.controls['frequency_unit'].updateValueAndValidity();
    }

    handleFixedAmountChange(checked: boolean) {
        if (checked) {
            this.form.controls['amount'].setValidators([Validators.required, Validators.min(1)]);
        } else {
            this.form.controls['amount'].clearValidators();
        }
        this.form.controls['amount'].updateValueAndValidity();
    }
}

