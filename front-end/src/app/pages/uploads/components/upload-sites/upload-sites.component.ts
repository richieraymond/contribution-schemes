import { Component, OnInit } from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-sites',
  templateUrl: './upload-sites.component.html',
  styleUrls: ['./upload-sites.component.scss']
})
export class UploadSitesComponent extends CommonComponent implements OnInit {

  constructor(commonService: CommonService,
              helper: RemoteHelper,
              loaderService: LoaderService,
              parentRouter: Router,
              private router: ActivatedRoute,
              private builder: FormBuilder,
              modalService: NgbModal) {
    super(commonService, helper, loaderService, parentRouter, modalService);
  }

  ngOnInit(): void {
  }

  submitFile() {
    const controller = this;
    const formData = new FormData();
    const inputFile = (<HTMLInputElement>document.getElementById('fileInput'));
    if (inputFile.files && inputFile.files[0]) {
      formData.append('file', inputFile.files[0]);
    }
    console.log(inputFile);

    this.sendRequestToServer('uploads/uploadSites',
        'postupload',
        formData,
        true,
        function (response: any) {
          const serverResponse = controller.handleResponse(response);
          if (serverResponse.success) {
            controller.commonService.showSuccess(serverResponse.message);
            controller.redirectToSiteBatch();
          } else {
            controller.commonService.showError(serverResponse.message);
          }
        }, function (error: any) {
          controller.commonService.showError(error.error.message);
        });

  }
  handleResponse(response) {
    console.log(response)
    return response;
  }
  redirectToSiteBatch() {
    setTimeout((val: any) => {
      this.parentRouter.navigate(['uploads/uploaded-site-batch']);
    }, 2000);
  }
}
