import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent extends CommonComponent implements OnInit {
    companies: any[] = [];
    form: FormGroup;
    formErrors = {
        name: '',
    };
    validationMessages = {
        name: {
            required: 'RFID is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        }
    };
    display: any = true;
    endPoint = 'scheme/type';
    categoryId: any;
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
        this.categoryId = this.router.snapshot.params.categoryId;
        if (this.categoryId) {
            this.getCategoryId(this.categoryId);
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

        if (this.categoryId) {
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
        this.sendRequestToServer(this.endPoint + '/' + this.categoryId,
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
        setTimeout((val: any) => {
            this.parentRouter.navigate(['scheme/scheme-categories']);
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
                    controller.form.controls['name'].setValue(serverResponse.type.name);
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
