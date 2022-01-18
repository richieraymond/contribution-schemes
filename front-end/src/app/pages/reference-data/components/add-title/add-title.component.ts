import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-title',
    templateUrl: './add-title.component.html',
    styleUrls: ['./add-title.component.scss']
})
export class AddTitleComponent extends CommonComponent implements OnInit {
    form: FormGroup;
    formErrors = {
        name: '',
        max_dependents: '',
        has_children: '',
        gender: '',
    };
    validationMessages = {
        name: {
            required: 'Name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        max_dependents: {
            required: 'This field is required',
            min: 'Minimum value is zero',
        },
        has_children: {
            required: 'This field is required',
        },
        gender: {
            required: 'This field is required',
        }
    };
    display: any = true;
    endPoint = 'refdata/title';
    titleId: any;
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
        this.form = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'max_dependents': [null, [Validators.required, Validators.min(0)]],
            'has_children': [true, [Validators.required]],
            'gender': [null, [Validators.required]],
        });
        this.titleId = this.router.snapshot.params.titleId;
        if (this.titleId) {
            this.getTitleData(this.titleId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    submitForm() {
        const controller = this;
        this.form.markAllAsTouched();
        this.validateCategoryForm();
        if (this.form.invalid) {
            return;
        }

        if (this.titleId) {
            this.updateCategory();
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

    updateCategory() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.titleId,
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
        setTimeout(() => {
            this.parentRouter.navigate(['refdata/view-titles']);
        }, 2000);
    }

    private getTitleData(categoryId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + categoryId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.form.controls['name'].setValue(response.title.name);
                    controller.form.controls['max_dependents'].setValue(response.title.max_dependents);
                    controller.form.controls['has_children'].setValue(response.title.has_children);
                    controller.form.controls['gender'].setValue(response.title.gender);
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateCategoryForm() {
        this.validateForm(this.form, this.validationMessages, this.formErrors);
    }
}
