import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-branch',
    templateUrl: './add-branch.component.html',
    styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent extends CommonComponent implements OnInit {
    roles: any;
    form: FormGroup;
    formErrors = {
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        location: '',
        hierarchy_id: '',
        parent_branch: ''

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
        hierarchy_id: {
            required: 'Hierarchy is required',
        },
        parent_branch: {
            required: 'Parent branch is required',
        }
    };
    display: any = true;
    endPoint = 'scheme/branch';
    private schemeId: any;
    schemehierarchies: any[] = [];
    branches: any[] = [];
    branchId: any;

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
        this.branchId = this.router.snapshot.params.branchId;
        this.form = this.builder.group({
            'name': [null, [Validators.required, Validators.maxLength(50)]],
            'location': [null, [Validators.maxLength(50)]],
            'contact_person': [null, [Validators.maxLength(50)]],
            'phone': [null, [Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': [null, [Validators.email]],
            'hierarchy_id': [null, []],
            'parent_branch': [null, []],
            'scheme_id': [this.schemeId, []],
        });
        this.getShemeCategories();
        this.getSchemeBranches();
        if (this.branchId) {
            this.getBranchData(this.branchId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    submitForm() {
        const controller = this;
        this.form.markAllAsTouched();
        this.validateSchemeForm();
        if (this.form.invalid) {
            return;
        }
        if (this.branchId) {
            this.updateScheme();
            return;
        }
        this.sendRequestToServer(this.endPoint,
            'post',
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

    updateScheme() {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + this.branchId,
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
            this.parentRouter.navigate(['scheme/scheme-profile', this.schemeId]);
        }, 2000);
    }

    private getBranchData(branchId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + branchId,
            'get',
            JSON.stringify(this.form.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.form.controls['name'].setValue(response?.branch?.name);
                    controller.form.controls['location'].setValue(response?.branch?.location);
                    controller.form.controls['email'].setValue(response?.branch?.email);
                    controller.form.controls['phone'].setValue(response?.branch?.phone);
                    controller.form.controls['contact_person'].setValue(response?.branch?.contact_person);
                    controller.form.controls['hierarchy_id'].setValue(response?.branch?.hierarchy_id);
                    controller.form.controls['parent_branch'].setValue(response?.branch?.parent_branch);
                    controller.form.controls['scheme_id'].setValue(response?.branch?.scheme_id);
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    validateSchemeForm() {
        this.validateForm(this.form, this.validationMessages, this.formErrors);
    }

    private getShemeCategories() {
        const controller = this;
        this.sendRequestToServer('scheme/hierarchy-by-scheme/' + this.schemeId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.schemehierarchies = response?.hierarchies;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    private getSchemeBranches() {
        const controller = this;
        this.sendRequestToServer('scheme/branch-by-scheme/' + this.schemeId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.branches = response?.branches;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }
}
