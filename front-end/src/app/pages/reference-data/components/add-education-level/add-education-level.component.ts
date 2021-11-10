import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-education-level',
    templateUrl: './add-education-level.component.html',
    styleUrls: ['./add-education-level.component.scss']
})
export class AddEducationLevelComponent extends CommonComponent implements OnInit {
    companies: any[] = [];
    form: FormGroup;
    formErrors = {
        name: '',
    };
    validationMessages = {
        name: {
            required: 'Name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        }
    };
    display: any = true;
    endPoint = 'refdata/educationlevel';
    educationLevelId: any;
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
        });
        this.educationLevelId = this.router.snapshot.params.educationLevelId;
        if (this.educationLevelId) {
            this.getCategoryId(this.educationLevelId);
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

        if (this.educationLevelId) {
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
        this.sendRequestToServer(this.endPoint + '/' + this.educationLevelId,
            'put',
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

    redirect() {
        setTimeout(() => {
            this.parentRouter.navigate(['refdata/view-education-levels']);
        }, 2000);
    }

    private getCategoryId(categoryId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + categoryId,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.form.controls['name'].setValue(serverResponse.educationlevel.name);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateCategoryForm() {
        this.validateForm(this.form, this.validationMessages, this.formErrors);
    }
}
