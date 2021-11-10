import {FormArray, FormGroup} from '@angular/forms';
import {AppUser, CommonService} from './CommonService';
import {RemoteHelper} from './RemoteHelper';
import {Router} from '@angular/router';
import {LoaderService} from './LoaderService';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../environments/environment';
import {Component} from '@angular/core';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';

const client = require('pusher-js');

@Component({
    template: ''
})
export class CommonComponent {

    public user: AppUser;
    imageURL: any = 'http://localhost:8000/images/';

    constructor(public commonService: CommonService,
                public helper: RemoteHelper,
                public loaderService: LoaderService,
                protected  parentRouter: Router,
                public modalService: NgbModal
    ) {
        this.commonService.user.subscribe((val: AppUser) => {
            this.user = val;
        });
        if (environment.production) {
            this.imageURL = 'https://images.akuagroup.xyz/peecenergy/';
        }
    }

    protected sendRequestToServer(url: string,
                                  requestType: any,
                                  requestData: any,
                                  blockui: boolean = true,
                                  responseHandler: any,
                                  errorHandler: any
    ) {
        this.loaderService.display(blockui);
        const requestOperation: any = this.helper.sendPostToServer(url, requestType, requestData);

        const controller = this;
        requestOperation.subscribe(
            (response: any) => {
                this.loaderService.display(false);
                if (responseHandler) {
                    responseHandler(response);
                }
            }, (err: any) => {
                this.loaderService.display(false);
                if (errorHandler) {
                    errorHandler(err);
                }
            });
    }

    formatAmount(amount: string) {
        return (Number(amount)).toLocaleString('en');
    }

    formatDate(date) {
        const format = {
            dd: this.formatData(date.getDate()),
            mm: this.formatData(date.getMonth() + 1),
            yyyy: date.getFullYear(),
            HH: this.formatData(date.getHours()),
            hh: this.formatData(this.formatHour(date.getHours())),
            MM: this.formatData(date.getMinutes()),
            SS: this.formatData(date.getSeconds()),
        };
        return format.dd + '/' + format.mm + '/' + format.yyyy + ' ' + format.HH + ':' + format.MM + ':' + format.SS;
    }

    formatData(input) {
        if (input > 9) {
            return input;
        } else {
            return `0${input}`;
        }
    }

    loadXHR(url) {
        let finalUrl = 'http://localhost:8000/api/' + url;
        if (environment.production) {
            finalUrl = 'https://esalesapi.akuagroup.xyz/api/' + url;
        }
        return new Promise(function (resolve, reject) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', finalUrl);
                xhr.responseType = 'blob';
                xhr.onerror = function () {
                    reject('Network error.');
                };
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject('Loading error:' + xhr.statusText);
                    }
                };
                xhr.send();
            } catch (err) {
                reject(err.message);
            }
        });
    }

    formatHour(input) {
        if (input > 12) {
            return input - 12;
        }
        return input;
    }

    downloadPdf(cols: any[], data: any[], docName: any) {
        const doc = new jsPDF();
        const col = [];
        const temp = [];
        const row = [];
        const options = [];
        cols.forEach(val => {
            col.push(val.header);
            row.push(val.field);
            options.push(val.options);
        });
        const rows = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < row.length; j++) {
                const key = row[j] + '';
                const option = options[j];

                if (key.indexOf('.') > 0 && data[i][key.split('.')[0]]) {
                    temp.push(data[i][key.split('.')[0]][key.split('.')[1]]);
                } else {
                    let value = data[i][key];
                    if (option && option?.concatfields) {
                        option?.fields?.forEach(val => {
                            value += ' ' + data[i][val];
                        });
                    }
                    temp.push(value);
                }
            }
            rows.push(temp);
        }
        autoTable(doc, {head: [col], body: rows});
        doc.save(docName);
    }

    logDev(data: any) {
        if (!environment.production) {
            console.log(data);
        }
    }

    parseAsFloat(number: any) {
        return parseFloat(number);
    }

    validateForm(group: FormGroup, validationMessages?: any, formErrors?: any): void {
        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);
            if (abstractControl instanceof FormGroup) {
                this.validateForm(abstractControl);
            } else if (abstractControl instanceof FormArray) {
                const formGroups: FormArray = abstractControl;
                for (let i = 0; i <= formGroups.length; i++) {
                    if (formGroups.controls[i] instanceof FormGroup) {
                        this.validateForm((<FormGroup>formGroups.controls[i]));
                    } else if (formGroups.controls[i] instanceof FormArray) {
                        // @ts-ignore
                        this.handleFormArray(formGroups[i]);
                    }
                }
            } else {
                formErrors[key] = '';
                if (abstractControl && !abstractControl.valid
                    && (abstractControl.touched || abstractControl.dirty)) {
                    const messages = validationMessages[key];
                    for (const errorKey in abstractControl.errors) {
                        if (errorKey) {
                            formErrors[key] += messages[errorKey] + ' ';
                        }
                    }
                }
            }
        });
    }

    handleFormArray(formArray: any) {
        for (let i = 0; i <= formArray.length; i++) {
            if (formArray.controls[i] instanceof FormGroup) {
                this.validateForm((<FormGroup>formArray.controls[i]));
            } else if (formArray.controls[i] instanceof FormArray) {
                this.handleFormArray(formArray[i]);
            }
        }
    }
}
