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
    selector: 'app-contribution-report',
    templateUrl: './contribution-report.component.html',
    styleUrls: ['./contribution-report.component.scss']
})
export class ContributionReportComponent extends CommonComponent implements OnInit {
    cols: any;
    contributions: any = [];
    private endPoint = 'scheme/contributions';

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
            {field: 'first_name', header: 'Contributor'},
            {field: 'amount', header: 'Amount'},
            {field: 'project_name', header: 'Cause'},
            {field: 'payment_channel', header: 'Payment Channel'}
        ];
        this.getRecords();
    }

    getRecords() {
        const controller = this;
        const postObject = {};
        this.sendRequestToServer(this.endPoint,
            'post',
            postObject,
            true,
            function (response: any) {
                if (response.success) {
                    controller.contributions = response.contributions;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

}
