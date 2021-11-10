import {Component, Directive, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonComponent} from '../../app-services/CommonComponent';
import {CommonService} from '../../app-services/CommonService';
import {RemoteHelper} from '../../app-services/RemoteHelper';
import {LoaderService} from '../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-contributor',
    templateUrl: './contributor.component.html',
    styleUrls: ['./contributor.component.scss'],
    animations: [
        trigger('mobileMenuTop', [
            state('no-block, void',
                style({
                    overflow: 'hidden',
                    height: '0px',
                })
            ),
            state('yes-block',
                style({
                    height: AUTO_STYLE,
                })
            ),
            transition('no-block <=> yes-block', [
                animate('400ms ease-in-out')
            ])
        ]),
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
        trigger('slideOnOff', [
            state('on', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('off', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('on => off', animate('400ms ease-in-out')),
            transition('off => on', animate('400ms ease-in-out'))
        ]),
        trigger('fadeInOutTranslate', [
            transition(':enter', [
                style({opacity: 0}),
                animate('400ms ease-in-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translate(0)'}),
                animate('400ms ease-in-out', style({opacity: 0}))
            ])
        ])
    ]
})

export class ContributorComponent extends CommonComponent implements OnInit {
    navType: string; /* st1, st2(default), st3, st4 */
    themeLayout: string; /* vertical(default) */
    layoutType: string; /* dark, light */
    verticalPlacement: string; /* left(default), right */
    verticalLayout: string; /* wide(default), box */
    deviceType: string; /* desktop(default), tablet, mobile */
    verticalNavType: string; /* expanded(default), offcanvas */
    verticalEffect: string; /* shrink(default), push, overlay */
    vNavigationView: string; /* view1(default) */
    pcodedHeaderPosition: string; /* fixed(default), relative*/
    pcodedSidebarPosition: string; /* fixed(default), absolute*/
    headerTheme: string; /* theme1(default), theme2, theme3, theme4, theme5, theme6 */
    logoTheme: string; /* theme1(default), theme2, theme3, theme4, theme5, theme6 */

    innerHeight: string;
    windowWidth: number;

    toggleOn: boolean;

    headerFixedMargin: string;
    navBarTheme: string; /* theme1, themelight1(default)*/
    activeItemTheme: string; /* theme1, theme2, theme3, theme4(default), ..., theme11, theme12 */

    isCollapsedMobile: string;
    isCollapsedSideBar: string;

    chatToggle: string;
    chatToggleInverse: string;
    chatInnerToggle: string;
    chatInnerToggleInverse: string;

    menuTitleTheme: string; /* theme1, theme2, theme3, theme4, theme5(default), theme6 */
    itemBorder: boolean;
    itemBorderStyle: string; /* none(default), solid, dotted, dashed */
    subItemBorder: boolean;
    subItemIcon: string; /* style1, style2, style3, style4, style5, style6(default) */
    dropDownIcon: string; /* style1(default), style2, style3 */
    isSidebarChecked: boolean;
    isHeaderChecked: boolean;

    @ViewChild('searchFriends') search_friends: ElementRef;
    public config: any;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
        this.navType = 'st1';
        this.themeLayout = 'horizontal';
        this.vNavigationView = 'view1';
        this.verticalPlacement = 'top';
        this.verticalLayout = 'widebox';
        this.deviceType = 'desktop';
        this.verticalNavType = 'expanded';
        this.verticalEffect = 'shrink';
        this.pcodedHeaderPosition = 'fixed';
        this.pcodedSidebarPosition = 'fixed';
        this.headerTheme = 'theme4';
        this.logoTheme = 'theme4';
        this.layoutType = 'light';
        this.toggleOn = true;

        this.headerFixedMargin = '80px';
        this.navBarTheme = 'themelight1';
        this.activeItemTheme = 'theme4';

        this.isCollapsedMobile = 'no-block';
        this.isCollapsedSideBar = 'no-block';

        this.chatToggle = 'out';
        this.chatToggleInverse = 'in';
        this.chatInnerToggle = 'off';
        this.chatInnerToggleInverse = 'on';

        this.menuTitleTheme = 'theme5';
        this.itemBorder = true;
        this.itemBorderStyle = 'none';
        this.subItemBorder = true;
        this.subItemIcon = 'style6';
        this.dropDownIcon = 'style1';
        this.isSidebarChecked = true;
        this.isHeaderChecked = true;

        const scrollHeight = window.screen.height - 150;
        this.innerHeight = scrollHeight + 'px';
        this.windowWidth = window.innerWidth;
        this.setMenuAttributes(this.windowWidth);
    }


    ngOnInit() {
        this.setBackgroundPattern('pattern2');
    }

    onResize(event) {
        this.innerHeight = event.target.innerHeight + 'px';
        /* menu responsive */
        this.windowWidth = event.target.innerWidth;
        let reSizeFlag = true;
        if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
            reSizeFlag = false;
        } else if (this.deviceType === 'phone' && this.windowWidth < 768) {
            reSizeFlag = false;
        }
        /* for check device */
        if (reSizeFlag) {
            this.setMenuAttributes(this.windowWidth);
        }
    }

    setMenuAttributes(windowWidth) {
        if (windowWidth >= 768 && windowWidth <= 1024) {
            this.deviceType = 'tablet';
            this.verticalNavType = 'offcanvas';
            this.verticalEffect = 'push';
        } else if (windowWidth < 768) {
            this.deviceType = 'phone';
            this.verticalNavType = 'offcanvas';
            this.verticalEffect = 'overlay';
        } else {
            this.deviceType = 'desktop';
            this.verticalNavType = 'expanded';
            this.verticalEffect = 'shrink';
        }
    }

    setBackgroundPattern(pattern) {
        document.querySelector('body').setAttribute('themebg-pattern', pattern);
    }
}

