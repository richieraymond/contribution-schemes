import {Component, OnInit} from '@angular/core';

import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/worldLow.js';
import {CommonComponent} from '../../../app-services/CommonComponent';
import {CommonService} from '../../../app-services/CommonService';
import {RemoteHelper} from '../../../app-services/RemoteHelper';
import {LoaderService} from '../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

declare const $: any;

@Component({
    selector: 'app-dashboard-default',
    templateUrl: './dashboard-default.component.html',
    styleUrls: [
        './dashboard-default.component.scss',
        '../../../../assets/icon/svg-animated/svg-weather.css'
    ]
})
export class DashboardDefaultComponent extends CommonComponent implements OnInit {
    contributors = 0;
    users = 0;
    branches = 0;
    projects = 0;
    admins = 0;
    schemes = 0;
    recentcheckins = [];
    inactivesites = [];
    options: any;
    showMaps = false;

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
        this.getDashboardStats();
    }

    getDashboardStats() {
        const controller = this;
        this.sendRequestToServer('reports/dashboard',
            'get',
            JSON.stringify(null),
            true,
            function (response: any) {
                if (response.success) {
                    controller.admins = response.admins;
                    controller.users = response.users;
                    controller.contributors = response.contributors;
                    controller.branches = response.branches;
                    controller.projects = response.projects;
                    controller.schemes = response.schemes;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    navigateToPath(path: string) {
        this.parentRouter.navigate([path]);
    }
}
