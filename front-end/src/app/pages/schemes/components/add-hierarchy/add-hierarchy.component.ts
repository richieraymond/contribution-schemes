import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-hierarchy',
    templateUrl: './add-hierarchy.component.html',
    styleUrls: ['./add-hierarchy.component.scss']
})
export class AddHierarchyComponent extends CommonComponent implements OnInit {
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
    endPoint = 'scheme/hierarchy';
    schemeId: any;
    hierarchyId: any;
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
        this.schemeId = this.router.snapshot.params.schemeId;
        this.hierarchyId = this.router.snapshot.params.hierarchyId;

        this.form = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'scheme_id': [this.schemeId, [Validators.required]],
        });

        if (this.hierarchyId) {
            this.getData(this.hierarchyId);
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

        if (this.hierarchyId) {
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
                    controller.redirect(serverResponse?.hierarchy);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRecord() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.hierarchyId,
            'put',
            JSON.stringify(this.form.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.redirect(serverResponse?.hierarchy);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirect(hierarchy: any) {
        setTimeout((val: any) => {
            this.parentRouter.navigate(['scheme/scheme-profile', hierarchy.scheme_id]);
        }, 2000);
    }

    private getData(id: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + id,
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.form.controls['name'].setValue(serverResponse.hierarchy.name);
                    controller.form.controls['scheme_id'].setValue(serverResponse.hierarchy.scheme_id);
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
