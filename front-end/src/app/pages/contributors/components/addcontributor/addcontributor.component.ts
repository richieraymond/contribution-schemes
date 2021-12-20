import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {FileUpload} from 'primeng/fileupload';

@Component({
    selector: 'app-addcontributor',
    templateUrl: './addcontributor.component.html',
    styleUrls: ['./addcontributor.component.scss']
})

export class AddContributorComponent extends CommonComponent implements OnInit, AfterViewInit {
    @ViewChild('fileInput') fileInput: FileUpload;
    roles: any;
    form: FormGroup;
    formErrors = {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        branch_id: null,
        title: '',
        gender: '',
        dob: '',
        maritalstatus: '',
        other_phone: '',
        home_parish: '',
        center: '',
        residence: '',
        biological_mother: '',
        biological_father: '',
        spouse: '',
        next_of_kin: '',
        kin_telephone: '',
        other_kin_telephone: '',
        kin_email: '',
        other_kin_email: '',
        education_level: '',
        children: '',
    };
    validationMessages = {
        first_name: {
            required: 'First name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        last_name: {
            required: 'Sur name is required',
            pattern: 'Name must contain only text',
            maxLength: 'Name be less than 100 characters',
        },
        phone: {
            required: 'Phone number is required',
            pattern: 'Enter a valid phone number e.g. 256704655303'
        },
        email: {
            email: 'Enter a valid email',
            required: 'Email address is required',
        },
        branch_id: {
            required: 'Branch is required'
        },
        title: {
            required: 'Title is required'
        },
        gender: {
            required: 'Gender is required'
        },
        dob: {
            required: 'Date of birth is required'
        },
        maritalstatus: {
            required: 'Marital status is required'
        },
        other_phone: {
            required: 'Other phone is required',
            pattern: 'Enter a valid phone number e.g. 256700000000'
        },
        home_parish: {
            required: 'Home parish is required'
        },
        center: {
            required: 'Center is required'
        },
        residence: {
            required: 'Residence is required'
        },
        biological_mother: {
            required: 'Biological mother is required'
        },
        biological_father: {
            required: 'Biological father is required'
        },
        spouse: {
            required: 'Spouse is required'
        },
        next_of_kin: {
            required: 'Next of kin is required'
        },
        kin_telephone: {
            required: 'Phone number is required'
        },
        other_kin_telephone: {
            required: 'Phone number is required'
        },
        kin_email: {
            required: 'Email is required',
            email: 'Please enter a valid email'
        },
        other_kin_email: {
            required: 'Email is required',
            email: 'Please enter a valid email'
        },
        education_level: {
            required: 'Education level is required',
        },
        children: {
            required: 'Bilogical children are required',
        }
    };
    display: any = true;
    endPoint = 'scheme/contributor';
    contributorId: any;
    titles: any[] = [];
    profilePhoto: File = null;
    image: any;
    maritalstatus: '';
    education_levels: '';
    showChildDetailsInput = false;
    contributorChildren: any[] = [];
    clonedChildren: any = {};
    children2: any[] = [];
    items: any[] = [];
    selectedTitle: any = {};

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private router: ActivatedRoute,
                private builder: FormBuilder,
                private sanitizer: DomSanitizer,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit(): void {
        this.form = this.builder.group({
            'first_name': [null, [Validators.required, Validators.maxLength(50)]],
            'last_name': [null, [Validators.required, Validators.maxLength(50)]],
            'phone': ['', [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'email': ['', [Validators.required, Validators.email]],
            'profile_pic': [null, []],
            'contributor_id': [null, []],
            'title': ['', []],
            'gender': ['', []],
            'dob': ['', [Validators.required]],
            'maritalstatus': [null, Validators.required],
            'other_phone': ['', [Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'home_parish': ['', [Validators.required]],
            'center': ['', [Validators.required]],
            'residence': ['', [Validators.required]],
            'biological_mother': ['', []],
            'biological_father': ['', []],
            'spouse': ['', []],
            'next_of_kin': ['', [Validators.required]],
            'kin_telephone': ['', [Validators.required, Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'other_kin_telephone': ['', [Validators.pattern('^(\\+?\\d{3} ?\\d{3} ?\\d{3} ?\\d{3}$)')]],
            'kin_email': ['', [Validators.required, Validators.email]],
            'other_kin_email': ['', [Validators.email]],
            'children': [[], []],
            'education_level': ['', [Validators.required]]
        });
        this.contributorId = this.router.snapshot.params.contributorId;
        this.getRegistrationData('refdata/title');
        this.getRegistrationData('refdata/maritalstatus');
        this.getRegistrationData('refdata/educationlevel');
    }

    ngAfterViewInit() {
        if (this.contributorId) {
            this.getData(this.contributorId);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    submitForm() {
        const controller = this;
        this.form.markAllAsTouched();
        this.validateContributorForm();
        if (this.form.invalid) {
            return;
        }
        if (this.contributorId) {
            this.form.controls['contributor_id'].setValue(this.contributorId);
        }
        const formData = new FormData();
        formData.append('first_name', this.form.controls['first_name'].value);
        formData.append('last_name', this.form.controls['last_name'].value);
        formData.append('phone', this.form.controls['phone'].value);
        formData.append('email', this.form.controls['email'].value);
        formData.append('title', this.form.controls['title'].value);
        formData.append('gender', this.form.controls['gender'].value);
        formData.append('dob', this.form.controls['dob'].value.toLocaleString());
        formData.append('maritalstatus', this.form.controls['maritalstatus'].value);
        formData.append('other_phone', this.form.controls['other_phone'].value);
        formData.append('home_parish', this.form.controls['home_parish'].value);
        formData.append('center', this.form.controls['center'].value);
        formData.append('residence', this.form.controls['residence'].value);
        formData.append('biological_mother', this.form.controls['biological_mother'].value);
        formData.append('biological_father', this.form.controls['biological_father'].value);
        formData.append('spouse', this.form.controls['spouse'].value);
        formData.append('next_of_kin', this.form.controls['next_of_kin'].value);
        formData.append('kin_telephone', this.form.controls['kin_telephone'].value);
        formData.append('other_kin_telephone', this.form.controls['other_kin_telephone'].value);
        formData.append('kin_email', this.form.controls['kin_email'].value);
        formData.append('other_kin_email', this.form.controls['other_kin_email'].value);
        formData.append('children', JSON.stringify(this.contributorChildren));
        formData.append('education_level', this.form.controls['education_level'].value);

        if (this.profilePhoto) {
            formData.append('profile_pic', this.profilePhoto);
        }
        formData.append('contributor_id', this.form.controls['contributor_id'].value);
        this.sendRequestToServer(this.endPoint,
            'postupload',
            formData,
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.redirect();
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    redirect() {
        setTimeout(() => {
            this.parentRouter.navigate(['contributor/contributors']);
        }, 2000);
    }

    private getData(adminId: any) {
        const controller = this;
        this.sendRequestToServer(this.endPoint + '/' + adminId,
            'get',
            JSON.stringify(this.form.value),
            true,
            function (response: any) {
                if (response.success) {
                    controller.form.controls['first_name'].setValue(response.contributor.first_name);
                    controller.form.controls['last_name'].setValue(response.contributor.last_name);
                    controller.form.controls['email'].setValue(response.contributor.email);
                    controller.form.controls['phone'].setValue(response.contributor.phone);
                    controller.form.controls['title'].setValue(response.contributor.title);
                    controller.form.controls['gender'].setValue(response.contributor.gender);
                    controller.form.controls['dob'].setValue(new Date(response.contributor.dob));
                    controller.form.controls['maritalstatus'].setValue(response.contributor.maritalstatus);
                    controller.form.controls['other_phone'].setValue(response.contributor.other_phone);
                    controller.form.controls['home_parish'].setValue(response.contributor.home_parish);
                    controller.form.controls['center'].setValue(response.contributor.center);
                    controller.form.controls['residence'].setValue(response.contributor.residence);
                    controller.form.controls['biological_mother'].setValue(response.contributor.biological_mother);
                    controller.form.controls['biological_father'].setValue(response.contributor.biological_father);
                    controller.form.controls['spouse'].setValue(response.contributor.spouse);
                    controller.form.controls['next_of_kin'].setValue(response.contributor.next_of_kin);
                    controller.form.controls['kin_telephone'].setValue(response.contributor.kin_telephone);
                    controller.form.controls['other_kin_telephone'].setValue(response.contributor.other_kin_telephone);
                    controller.form.controls['kin_email'].setValue(response.contributor.kin_email);
                    controller.form.controls['other_kin_email'].setValue(response.contributor.other_kin_email);
                    controller.form.controls['education_level'].setValue(response.contributor.education_level);
                    controller.contributorChildren = response?.contributor?.children;
                    if (response.contributor.profile_pic) {
                        controller.getPhoto(response.contributor.profile_pic);
                    }
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    getPhoto(fileName: any) {
        let blob = null;
        const oReq = new XMLHttpRequest();
        oReq.open('GET', 'http://localhost:8000/api/contributor-image/' + fileName, true);
        oReq.responseType = 'arraybuffer';
        const self = this;
        oReq.onload = function (oEvent) {
            blob = new Blob([oReq.response], {type: 'image/jpeg'});
            blob.lastModifiedDate = new Date();
            blob.name = self.form.controls['first_name'].value;
            blob.objectURL = self.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(blob)));
            self.image = blob;
            self.fileInput.clear();
            self.fileInput.files.push(blob);
        };
        oReq.send();
    }

    validateContributorForm() {
        this.validateForm(this.form, this.validationMessages, this.formErrors);
    }

    onImageUpload($event: any) {
        this.profilePhoto = $event.files[0];
    }

    private getRegistrationData(endpoint: string) {
        const controller = this;
        this.sendRequestToServer(endpoint,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    switch (endpoint) {
                        case 'refdata/title':
                            controller.titles = response.titles;
                            break;
                        case 'refdata/maritalstatus':
                            controller.maritalstatus = response.maritalstatus;
                            break;
                        case 'refdata/educationlevel':
                            controller.education_levels = response.educationlevels;
                            break;
                        default:
                            throw Error('Unhandled endpoint');
                    }
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }


    onRowEditInit(child) {
        this.clonedChildren[child.id] = {...child};
    }

    onRowEditSave(child) {
        delete this.contributorChildren[child.id];
    }

    onRowEditCancel(child, index: number) {
        this.children2[index] = this.clonedChildren[child?.id];
        delete this.clonedChildren[child?.id];
    }

    addToArray() {
        if (this.contributorChildren.length === 0) {
            this.contributorChildren.push({id: 1, 'name': '', 'dob': ''});
        } else {
            if (this.selectedTitle?.max_dependents > 0 && this.contributorChildren.length < this.selectedTitle?.max_dependents) {
                this.contributorChildren.push({id: this.contributorChildren.length + 2, 'name': '', 'dob': ''});
            } else {
                this.commonService.showInfo('You can not add more than ' + this.selectedTitle?.max_dependents + ' dependents');
            }
        }
    }

    updateValidators() {
        this.selectedTitle = this.titles.find(val => val?.id === this.form.controls['title'].value);
        this.form.controls['gender'].setValue(this?.selectedTitle?.gender);
    }
}
