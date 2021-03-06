import {Component, Directive, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {animate, AUTO_STYLE, state, style, transition, trigger} from '@angular/animations';
import {MenuItems} from '../../shared/menu-items/menu-items';
import {CommonService} from '../../app-services/CommonService';
import {CommonComponent} from '../../app-services/CommonComponent';
import {RemoteHelper} from '../../app-services/RemoteHelper';
import {LoaderService} from '../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
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
export class AdminComponent extends CommonComponent implements OnInit {
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
    /*  @ViewChild('toggleButton', {static: false}) toggle_button: ElementRef;
      @ViewChild('sideMenu', {static: false}) side_menu: ElementRef;*/

    public config: any;

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                public menuItems: MenuItems,
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
        this.buildMenu();
    }


    ngOnInit() {
        this.setBackgroundPattern('pattern2');
    }

    buildMenu() {
        this.menuItems.clear();
        if (this.user.canManageMembers) {
            this.menuItems.add({
                label: 'Contributors',
                main: [
                    {
                        state: 'nav',
                        short_label: 'C',
                        name: 'Contributors',
                        type: 'sub',
                        icon: 'ti-home',
                        children: [
                            {
                                main_state: 'contributor',
                                state: 'add-contributor',
                                short_label: 'D',
                                name: 'Add Contributor',
                                type: 'link',
                                icon: 'ti-home'
                            }, {
                                main_state: 'contributor',
                                state: 'contributors',
                                short_label: 'D',
                                name: 'View Contributors',
                                type: 'link',
                                icon: 'ti-home'
                            }
                        ],
                    }
                ]
            });
        }


        if (this.user.canManageProjects) {
            this.menuItems.add({
                label: 'Causes',
                main: [
                    {
                        state: 'nav',
                        short_label: 'C',
                        name: 'Causes',
                        type: 'sub',
                        icon: 'ti-home',
                        children: [
                            {
                                main_state: 'project',
                                state: 'add-project',
                                short_label: 'D',
                                name: 'Add Cause',
                                type: 'link',
                                icon: 'ti-home'
                            }, {
                                main_state: 'contributor',
                                state: 'projects',
                                short_label: 'D',
                                name: 'View Causes',
                                type: 'link',
                                icon: 'ti-home'
                            }
                        ],
                    }
                ]
            });
        }

        if (this.user.canManageSchemes) {
            this.menuItems.add(
                {
                    label: 'Schemes',
                    main: [
                        {
                            state: 'scheme',
                            short_label: 'S',
                            name: 'Schemes',
                            type: 'sub',
                            icon: 'ti-layout-grid2-alt',
                            children: [
                                {
                                    main_state: 'scheme',
                                    state: 'add-scheme',
                                    short_label: 'B',
                                    name: 'Add Scheme',
                                    type: 'link',
                                    icon: 'ti-layout-grid2-alt',
                                },
                                {
                                    main_state: 'scheme',
                                    state: 'schemes',
                                    short_label: 'A',
                                    name: 'View Schemes',
                                    type: 'link',
                                    icon: 'ti-crown'
                                }
                            ]
                        }
                    ]
                }
            );
        }
        const userManagementMenu = {
            label: 'User',
            main: [
                {
                    state: 'user',
                    short_label: 'U',
                    name: 'User Management',
                    type: 'sub',
                    icon: 'ti-bar-chart-alt',
                    children: []
                }
            ]
        };

        const reportsMenu = {
            label: 'Reports',
            main: [
                {
                    state: 'reports',
                    short_label: 'R',
                    name: 'Reports',
                    type: 'sub',
                    icon: 'ti-bar-chart-alt',
                    children: []
                }
            ]
        };

        /**
         * Reports
         */
        if (this.user.canManageMembers) {
            reportsMenu.main[0].children.push({
                main_state: 'reports',
                state: 'contributors-report',
                name: 'Members Report',
                type: 'link',
                children: []
            });
        }
        if (this.user.canManageProjects) {
            reportsMenu.main[0].children.push({
                main_state: 'reports',
                state: 'contributions-report',
                name: 'Contributions Report',
                type: 'link',
                children: []
            });
        }
        const settingsMenu = {
            label: 'Settings',
            main: [
                {
                    state: 'settings',
                    short_label: 'S',
                    name: 'Settings',
                    type: 'sub',
                    icon: 'ti-bar-chart-alt',
                    children: []
                }
            ]
        };

        /**
         * Settings
         */
        if (this.user.canManageSettings) {
            settingsMenu.main[0].children.push({
                main_state: 'settings',
                state: 'scheme',
                name: 'Scheme Categories',
                type: 'sub',
                children: [
                    {
                        main_state: 'scheme',
                        state: 'add-scheme-category',
                        name: 'Add Category',
                        type: 'link',
                    },
                    {
                        main_state: 'scheme',
                        state: 'scheme-categories',
                        name: 'View Categories',
                        type: 'link',
                    },
                ]
            });

            /**
             * Settings
             */
            settingsMenu.main[0].children.push({
                main_state: 'settings',
                state: 'scheme',
                name: 'Scheme Hierarchies',
                type: 'sub',
                children: [
                    {
                        main_state: 'scheme',
                        state: 'add-scheme-hierarchy',
                        name: 'Add Hierarchy',
                        type: 'link',
                    },
                    {
                        main_state: 'scheme',
                        state: 'scheme-hierarchies',
                        name: 'View Hierarchies',
                        type: 'link',
                    },
                ]
            });

            settingsMenu.main[0].children.push({
                main_state: 'refdata',
                state: 'refdata',
                name: 'Marital Status',
                type: 'sub',
                children: [
                    {
                        main_state: 'refdata',
                        state: 'add-marital-status',
                        name: 'Add',
                        type: 'link',
                    },
                    {
                        main_state: 'refdata',
                        state: 'view-marital-status',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });

            settingsMenu.main[0].children.push({
                state: 'refdata',
                name: 'Titles',
                type: 'sub',
                children: [
                    {
                        state: 'add-title',
                        name: 'Add',
                        type: 'link',
                    },
                    {
                        state: 'view-titles',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });

            settingsMenu.main[0].children.push({
                main_state: 'refdata',
                state: 'refdata',
                name: 'Education Levels',
                type: 'sub',
                children: [
                    {
                        main_state: 'refdata',
                        state: 'add-education-level',
                        name: 'Add',
                        type: 'link',
                    },
                    {
                        main_state: 'refdata',
                        state: 'view-education-levels',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });
        }

        if (this.user.canManageAdmins) {
            userManagementMenu.main[0].children.push({
                main_state: 'user',
                state: 'user',
                name: 'Admins',
                type: 'sub',
                children: [
                    {
                        main_state: 'user',
                        state: 'add-admin',
                        name: 'Add',
                        type: 'link',
                    },
                    {
                        main_state: 'user',
                        state: 'admins',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });
        }

        if (this.user.canManageSchemeUsers) {
            userManagementMenu.main[0].children.push({
                main_state: 'user',
                state: 'user',
                name: 'Scheme Users',
                type: 'sub',
                children: [
                    {
                        main_state: 'user',
                        state: 'add-user',
                        name: 'Add',
                        type: 'link',
                    },
                    {
                        main_state: 'user',
                        state: 'users',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });
        }

        const bulkUploadMenu = {
            label: 'Bulk Uploads',
            main: [
                {
                    state: 'uploads',
                    short_label: 'B',
                    name: 'Bulk Uploads',
                    type: 'sub',
                    icon: 'ti-bar-chart-alt',
                    children: []
                }
            ]
        };


        if (this.user.canManageUserRoles) {
            userManagementMenu.main[0].children.push({
                main_state: 'user',
                state: 'user',
                name: 'User Roles',
                type: 'sub',
                children: [
                    {
                        main_state: 'user',
                        state: 'add-role',
                        name: 'Add',
                        type: 'link',
                    }, {
                        main_state: 'user',
                        state: 'roles',
                        name: 'View',
                        type: 'link',
                    },
                ]
            });
        }

        if (userManagementMenu.main[0].children.length > 0) {
            this.menuItems.add(userManagementMenu);
        }
        if (bulkUploadMenu.main[0].children.length > 0) {
            this.menuItems.add(bulkUploadMenu);
        }
        if (reportsMenu.main[0].children.length > 0) {
            this.menuItems.add(reportsMenu);
        }
        if (settingsMenu.main[0].children.length > 0) {
            this.menuItems.add(settingsMenu);
        }
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

    toggleOpened() {
        if (this.windowWidth < 768) {
            this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
        }
        this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
        document.querySelector('#main_navbar').classList.toggle('show-menu');
    }

    onClickedOutside(e: Event) {
        if (this.windowWidth < 768 && this.toggleOn && this.verticalNavType !== 'offcanvas') {
            this.toggleOn = true;
            this.verticalNavType = 'offcanvas';
            document.querySelector('#main_navbar').classList.remove('show-menu');
        }
    }

    onMobileMenu() {
        this.isCollapsedMobile = this.isCollapsedMobile === 'yes-block' ? 'no-block' : 'yes-block';
    }

    toggleChatInner() {
        this.chatInnerToggle = this.chatInnerToggle === 'off' ? 'on' : 'off';
        this.chatInnerToggleInverse = this.chatInnerToggleInverse === 'off' ? 'on' : 'off';
    }

    setBackgroundPattern(pattern) {
        document.querySelector('body').setAttribute('themebg-pattern', pattern);
    }
}

@Directive({
    selector: '[appTrigger]'
})
export class LinkTriggerDirective {
    constructor(private elements: ElementRef) {
    }

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        let eleClass = '';
        let parentEle = (this.elements).nativeElement;
        while (eleClass !== 'menu-main-item') {
            if (parentEle.classList.contains('menu-main-item')) {
                eleClass = 'menu-main-item';
            } else {
                parentEle = parentEle.parentNode;
            }
        }
        parentEle.querySelector('.pcoded-hasmenu').classList.remove('pcoded-trigger');
        parentEle.querySelector('.main-click-trigger').click();
        document.querySelector('#main_navbar').classList.remove('show-menu');
    }
}
