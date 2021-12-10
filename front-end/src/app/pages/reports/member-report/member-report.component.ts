import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../app-services/CommonComponent';
import {CommonService} from '../../../app-services/CommonService';
import {RemoteHelper} from '../../../app-services/RemoteHelper';
import {LoaderService} from '../../../app-services/LoaderService';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-member-report',
    templateUrl: './member-report.component.html',
    styleUrls: ['./member-report.component.scss']
})
export class MemberReportComponent extends CommonComponent implements OnInit {
    cols: any;
    contributors: any = [];
    private endPoint = 'reports/contributors';

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private builder: FormBuilder,
                private confirmationService: ConfirmationService,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit(): void {
        this.cols = [
            {field: 'first_name', header: 'Name'},
            {field: 'email', header: 'Email'},
            {field: 'phone', header: 'Phone'},
            {field: 'status', header: 'Status'}
        ];
        this.getRecords();
    }

    getRecords() {
        const controller = this;
        const postObject = {};
        this.sendRequestToServer(this.endPoint,
            'get',
            postObject,
            true,
            function (response: any) {
                if (response.success) {
                    controller.contributors = response.contributors;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }
}
