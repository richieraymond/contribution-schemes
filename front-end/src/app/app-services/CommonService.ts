import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {BehaviorSubject} from 'rxjs';
import {RemoteHelper} from './RemoteHelper';
import {MessageService} from 'primeng/api';

@Injectable()
export class CommonService {
    public user: BehaviorSubject<AppUser>;
    cookies: Object;
    keys: Array<string>;
    private model: string;
    private contact: string;

    constructor(private helper: RemoteHelper,
                private router: Router,
                public cookieService: CookieService,
                private messageService: MessageService
    ) {
        const appUser = new AppUser();
        this.user = new BehaviorSubject<AppUser>(appUser);
        const loggedInUser = this.cookieService.get('loggedInUser');
        let parsed: any;
        if (loggedInUser != null && loggedInUser !== '') {
            parsed = JSON.parse(loggedInUser);
            this.user.getValue().setLoggedIn(parsed.loggedIn);
            this.user.getValue().setUserData(parsed.userData);
            this.user.getValue().setPermissions(parsed.permissions);
            this.user.getValue().setToken(parsed.token);
            this.user.getValue().setRole(parsed.role);
            this.user.getValue().evaluatePermissions();
        } else {
            this.router.navigate(['auth/login']);
        }
    }

    /**
     * Returns a pair of usernam and token to be included in subsequent server requests
     * @returns {any}
     */
    public getUserRequestCredentials() {
        const credentials: any = {};
        if (!this.user) {
            return credentials;
        }
        credentials.userData = this.user.getValue().userData;
        return credentials;
    }

    public setLoginStatus(status: boolean) {
        this.user.getValue().setLoggedIn(status);
        if (!status) {
            this.user.getValue().setUserData(null);
            this.user.getValue().setPermissions([]);
            this.user.getValue().setLoggedIn(false);
            this.user.getValue().setToken('');
            this.removeCookie('loggedInUser');
        } else {
            this.addCookie('loggedInUser', JSON.stringify({
                loggedIn: this.user.getValue().loggedIn,
                userData: this.user.getValue().userData,
                role: this.user.getValue().userRole,
                token: this.user.getValue().token,
                permissions: this.user.getValue().permissions
            }));
        }
    }

    isValidPhone(phone: string) {
        return /^(0|256)(7[178095]|39)\d{7}$/.test(phone);
    }

    numberWithCommas(num: any) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    logOut() {
        this.removeAll();
        this.router.navigate(['auth/login']);
    }

    showSuccess(message, key = 'message') {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            key: key,
        });
    }

    showError(message, key = 'message') {
        this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: message,
            key: key
        });
    }

    showWarning(message, key = 'message') {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning!!',
            detail: message,
            key: key
        });
    }

    showInfo(message, key = 'message') {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: message,
            key: key
        });
    }

    clearMessage(key: string = 'message') {
        if (key) {
            this.messageService.clear(key);
        } else {
            this.messageService.clear();
        }
    }

    updateCookies() {
        this.cookies = this.cookieService.getAll();
        this.keys = Object.keys(this.cookies);
    }

    updateCookieElement(element, value, cookieName) {
        const parsed = JSON.parse(this.cookieService.get(cookieName));
        parsed[element] = value;
        this.cookieService.delete(cookieName);
        this.cookieService.set(cookieName, JSON.stringify(parsed));
    }

    addCookie(cName: string, cValue: string) {
        this.helper.logDevMode('Adding: ' + cName + ' ' + cValue);
        this.cookieService.set(cName, cValue);
        this.updateCookies();
    }

    removeCookie(rName: string) {
        this.helper.logDevMode('Removing: ' + rName);
        this.cookieService.delete(rName);
        this.updateCookies();
    }

    removeAll() {
        this.helper.logDevMode('Removing all cookies');
        this.cookieService.deleteAll();
        this.updateCookies();
    }

    setModel(model: string) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    setContact(contact: string) {
        this.contact = contact;
    }

    getContact() {
        return this.contact;
    }
}

export class AppUser {
    loggedIn = false;
    permissions: any = undefined;
    userData: any = undefined;
    token: any = null;
    canManageAdmins = false;
    canManageSchemes = false;
    canManageUserRoles = false;
    canManageSchemeUsers = false;
    canManageMembers = false;
    userRole = '';
    canManageSettings: any = false;
    canManageProjects: any = false;

    constructor() {
        this.loggedIn = false;
        this.permissions = [];
    }

    setLoggedIn(status: boolean) {
        this.loggedIn = status;
        if (!status) {
            this.permissions = [];
        }
        this.evaluatePermissions();
    }

    public evaluatePermissions() {
        this.canManageAdmins = this.checkRequiredPermission('can_manage_admins');
        this.canManageSchemes = this.checkRequiredPermission('can_manage_groups');
        this.canManageUserRoles = this.checkRequiredPermission('can_manage_user_roles');
        this.canManageSchemeUsers = this.checkRequiredPermission('can_manage_group_admins');
        this.canManageMembers = this.checkRequiredPermission('can_manage_members');
        this.canManageSettings = this.checkRequiredPermission('can_manage_settings');
        this.canManageProjects = this.checkRequiredPermission('can_manage_projects');
    }

    private checkRequiredPermission(permission: string) {
        return !(this.permissions && this.permissions.indexOf(permission) < 0);
    }

    setUserData(userData: any) {
        this.userData = userData;
    }

    setPermissions(permissions: any[]) {
        this.permissions = permissions;
    }

    setToken(token: string) {
        this.token = token;
    }

    setRole(role: string) {
        this.userRole = role;
    }
}
