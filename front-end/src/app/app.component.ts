import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CommonComponent} from './app-services/CommonComponent';
import {CommonService} from './app-services/CommonService';
import {RemoteHelper} from './app-services/RemoteHelper';
import {LoaderService} from './app-services/LoaderService';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends CommonComponent implements OnInit {
    title = 'NEPSERV VANTAGE';
    showLoader;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                public loaderService: LoaderService,
                protected parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit() {
        this.parentRouter.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
        this.loaderService.loading$.subscribe((val: boolean) => {
            this.showLoader = val;
            console.log(this.showLoader);
        });
    }
}
