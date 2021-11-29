import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class RemoteHelper {
    private httpOptions: any;
    private uploadHttpOptions: any;
    private downloadHttpOptions: any;
    user: any = {};
    apiToken: any = '';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        this.updateLoggedInUser();
    }

    private uatServerUrl = 'http://localhost:8000/api/';
    private serverUrl = 'https://peecapi.akuagroup.xyz/api/';

    sendPostToServer(uri: String, requestType: any, data: any) {
        this.updateLoggedInUser();
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        
        let request;
        switch (requestType) {
            case 'post':
                request = this.postRequest(uri, data);
                break;
            case 'postupload':
                request = this.postUploadRequest(uri, data);
                break;
            case 'get':
                request = this.getRequest(uri);
                break;
            case 'getimage':
                request = this.getImageRequest(uri);
                break;
            case 'patch':
                request = this.patchRequest(uri, data);
                break;
            case 'put':
                request = this.putRequest(uri, data);
                break;
            case 'delete':
                request = this.deleteRequest(uri, data);
                break;
            default:
                this.logDevMode('Unable to find request type');
                break;
        }
        return request;
    }

    postRequest(uri: any, data: any): Observable<any> {
        console.log(this.serverUrl + uri);
        return this.http.post<any>(this.serverUrl + uri, data, this.httpOptions);
    }

    postUploadRequest(uri: any, data: any): Observable<any> {
        return this.http.post<any>(this.serverUrl + uri, data, this.uploadHttpOptions);
    }

    putRequest(outlet: any, body: any): Observable<any> {
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        return this.http.put(this.serverUrl + outlet, body, this.httpOptions);
    }

    patchRequest(outlet: any, body: any): Observable<any> {
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        return this.http.patch(this.serverUrl + outlet, body, this.httpOptions);
    }

    deleteRequest(outlet: any, body: any): Observable<any> {
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        return this.http.delete(this.serverUrl + outlet, this.httpOptions);
    }

    getImageRequest(outlet: any): Observable<any> {
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        return this.http.get(this.serverUrl + outlet, this.httpOptions);
    }

    getRequest(outlet: any): Observable<any> {
        if (!environment.production) {
            this.serverUrl = this.uatServerUrl;
        }
        return this.http.get(this.serverUrl + outlet, this.httpOptions);
    }


    logDevMode(event: string) {
        if (!environment.production) {
            console.log(event);
        }
    }

    updateLoggedInUser() {
        const loggedIn = this.cookieService.get('loggedInUser');
        if (loggedIn != null && loggedIn !== '') {
            this.user = JSON.parse(loggedIn);
        }
        if (this.user.token) {
            this.apiToken = this.user.token;
        } else {
            this.apiToken = this.user.api_token;
        }
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.apiToken
            }),
            observe: 'body'
        };
        this.downloadHttpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + this.apiToken
            }),
            observe: 'body'
        };
        this.uploadHttpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.apiToken
            })
        };
    }
}
