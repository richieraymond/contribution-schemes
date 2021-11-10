import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-scheme',
    templateUrl: './add-scheme.component.html',
    styleUrls: ['./add-scheme.component.scss']
})
export class AddSchemeComponent extends CommonComponent implements OnInit {
    roles: any;
    schemeForm: FormGroup;
    formErrors = {
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        location: '',
        category_id: '',
        is_membership_based: '',
    };
    validationMessages = {
        name: {
            required: 'Name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        contact_person: {
            required: 'Contact person is required',
            pattern: 'Contact person must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        location: {
            required: 'Location person is required',
            pattern: 'Location person must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        phone: {
            required: 'Phone number is required',
            pattern: 'Enter a valid phone number e.g. 256704655303'
        },
        email: {
            email: 'Enter a valid email',
            required: 'Email address is required',
        },
        category_id: {
            required: 'Scheme category is required',
        },
        is_membership_based: {
            required: 'This field is required',
        }
    };
    display: any = true;
    endPoint = 'scheme/scheme';
    private schemeId: any;
    schemecategories: any[] = [];

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
        this.schemeForm = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'location': [null, [Validators.required, Validators.maxLength(50)]],
            'contact_person': [null, [Validators.required, Validators.maxLength(50)]],
            'phone': [null, [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': [null, [Validators.required, Validators.email]],
            'category_id': [null, [Validators.required]],
            'is_membership_based': [null, [Validators.required]],
        });
        this.getShemeCategories();
        this.schemeId = this.router.snapshot.params.schemeId;
        if (this.schemeId) {
            this.getSchemeData(this.schemeId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    addScheme() {
        const controller = this;
        this.schemeForm.markAllAsTouched();
        this.validateSchemeForm();
        if (this.schemeForm.invalid) {
            return;
        }
        if (this.schemeId) {
            this.updateScheme();
            return;
        }
        this.sendRequestToServer(this.endPoint,
            'post',
            JSON.stringify(this.schemeForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.redirectToCompanies();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateScheme() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.schemeId,
            'put',
            JSON.stringify(this.schemeForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.commonService.showSuccess(serverResponse.message);
                    controller.redirectToCompanies();
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirectToCompanies() {
        setTimeout((val: any) => {
            this.parentRouter.navigate(['scheme/schemes']);
        }, 2000);
    }

    private getSchemeData(schemeId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + schemeId,
            'get',
            JSON.stringify(this.schemeForm.value),
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.schemeForm.controls['name'].setValue(serverResponse.scheme.name);
                    controller.schemeForm.controls['location'].setValue(serverResponse.scheme.location);
                    controller.schemeForm.controls['email'].setValue(serverResponse.scheme.email);
                    controller.schemeForm.controls['phone'].setValue(serverResponse.scheme.phone);
                    controller.schemeForm.controls['contact_person'].setValue(serverResponse.scheme.contact_person);
                    controller.schemeForm.controls['category_id'].setValue(serverResponse.scheme.category_id);
                    controller.schemeForm.controls['is_membership_based'].setValue(serverResponse.scheme.is_membership_based);
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateSchemeForm() {
        this.validateForm(this.schemeForm, this.validationMessages, this.formErrors);
    }

    private getShemeCategories() {
        const controller = this;
        this.sendRequestToServer('scheme/type',
            'get',
            null,
            true,
            function (response: any) {
                const serverResponse = controller.handleResponse(response);
                if (serverResponse.success) {
                    controller.schemecategories = serverResponse.types;
                } else {
                    controller.commonService.showError(serverResponse.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }
}
