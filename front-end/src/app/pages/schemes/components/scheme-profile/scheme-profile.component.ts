import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmationService} from 'primeng/api';

@Component({
    selector: 'app-scheme-profile',
    templateUrl: './scheme-profile.component.html',
    styleUrls: ['./scheme-profile.component.scss']
})
export class SchemeProfileComponent extends CommonComponent implements OnInit {
    private schemeId: any;
    schemeInfo: any = {};
    cols: any[] = [];
    guards = [];
    sites = [];
    zones = [];
    users = [];
    cards = [];

    guards_ = 0;
    sites_ = 0;
    users_ = 0;
    checkins_ = 0;
    zones_ = 0;
    hierarchies: any;
    branches: any[] = [];

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                private confirmationService: ConfirmationService,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }


    ngOnInit() {
        this.schemeId = this.router.snapshot.params.schemeId;
        this.fetchSchemeProfile();
    }

    fetchSchemeProfile() {
        const controller = this;
        this.sendRequestToServer('scheme/scheme/' + this.schemeId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.schemeInfo = response.scheme;
                    // controller.fetchInfo('stats', 'reports/company-stats/');
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    fetchInfo(action, url) {
        const controller = this;
        this.cols = [];
        this.sendRequestToServer(url + this.schemeId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    switch (action) {
                        case 'hierarchies':
                            controller.cols.push({field: 'name', header: 'Name'},
                                {field: 'status', header: 'Status'});
                            controller.hierarchies = response.hierarchies;
                            break;
                        case 'branches':
                            controller.cols = [
                                {field: 'name', header: 'Name'},
                                {field: 'location', header: 'Location'},
                                {field: 'contact_person', header: 'Contact Person'},
                                {field: 'phone', header: 'Phone'},
                                {field: 'email', header: 'Email'},
                                {field: 'actions', header: 'Status'},
                            ];
                            controller.branches = response?.branches;
                            break;
                        default:
                            throw new Error('Unknown action');
                    }
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    changeActiveIndex(event: number) {
        switch (event) {
            case 1:
                this.fetchInfo('hierarchies', 'scheme/hierarchy-by-scheme/');
                break;
            case 2:
                this.fetchInfo('branches', 'scheme/branch-by-scheme/');
                break;
            default:

        }
    }

    createHierarchy() {
        this.parentRouter.navigate(['scheme/add-scheme-hierarchy', this.schemeId]);
    }

    confirmAction(event: Event, b: boolean, rowData, endPoint: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateRecord(b, rowData, endPoint);
            }
        });
    }

    private updateRecord(status: boolean, rowData: any, endPoint: any) {
        const controller = this;
        rowData.status = status;
        this.sendRequestToServer(endPoint + '/' + rowData.id,
            'put',
            JSON.stringify(rowData),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.changeActiveIndex(1);
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    createBranch() {
        this.parentRouter.navigate(['scheme/create-branch', this.schemeId]);
    }


    editBranch(rowData) {
        this.parentRouter.navigate(['scheme/edit-branch', rowData?.id,this.schemeId]);
    }
}
