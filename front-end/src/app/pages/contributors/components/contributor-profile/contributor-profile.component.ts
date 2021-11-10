import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-contributor-profile',
    templateUrl: './contributor-profile.component.html',
    styleUrls: ['./contributor-profile.component.scss']
})
export class ContributorProfileComponent extends CommonComponent implements OnInit {
    private contributorId: any;
    contributorBio: any = {};
    contributions: any = [];
    cols: any = [];
    fromDate = new Date();
    toDate = new Date();
    children: any;
    childrenCols: any = [];

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }


    ngOnInit() {
        this.contributorId = this.router.snapshot.params.contributorId;
        this.cols = [
            {field: 'created_at', header: 'Date'},
            {field: 'amount', header: 'Amount'},
            {field: 'reason', header: 'Reason'}
        ];
        this.childrenCols = [
            {field: 'name', header: 'Name'},
            {field: 'dob', header: 'Date of birth'},
        ];
        this.getInfo();
    }

    getInfo() {
        const controller = this;
        this.sendRequestToServer('scheme/contributor/' + this.contributorId,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    console.log(response.contributor)
                    controller.contributorBio = response.contributor;
                    controller.children = response?.contributor?.children;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }
}
