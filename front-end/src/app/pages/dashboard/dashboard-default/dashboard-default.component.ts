import { Component, OnInit } from '@angular/core';

import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/worldLow.js';
import { CommonComponent } from '../../../app-services/CommonComponent';
import { CommonService } from '../../../app-services/CommonService';
import { RemoteHelper } from '../../../app-services/RemoteHelper';
import { LoaderService } from '../../../app-services/LoaderService';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    lineGraphData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    contributionGraphData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    lineGraph:any={};

    // type = 'line';
    // // data = {
    // //     labels: ["January", "February", "March", "April", "May", "June", "July"],
    // //     datasets: [
    // //         {
    // //             label: "My First dataset",
    // //             data: [650, 59, 80, 81, 56, 55, 40],
    // //             fill: false,
    // //             borderColor: 'rgb(75, 192, 192)',
    // //             tension: 0.1
    // //         }

    // //     ]
    // // };
    option = {
        responsive: true,
        maintainAspectRatio: true
    };

    polarGraph:any={};



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
                console.log('*****************************************');
                console.log(response);
                
                if (response.success) {
                    controller.admins = response.admins;
                    controller.users = response.users;
                    controller.contributors = response.contributors;
                    controller.branches = response.branches;
                    controller.projects = response.projects;
                    controller.schemes = response.schemes;
                    controller.graphFormat(response.contributorsGrowthGraph, controller.lineGraphData, 'LINE');
                    controller.graphFormat(response.totalContributions, controller.contributionGraphData, 'LINE');
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
                console.log('++++++++++++++++++++++++++++++++++++++++++++');
                
                console.log(error);
                
            });
    }

    navigateToPath(path: string) {
        this.parentRouter.navigate([path]);
    }

    graphFormat = (data, graphData, indicator) => {
        data.forEach(element => {
            if(element.month == '1'){
                graphData[0] = element.total
            }else if(element.month =='2'){
                graphData[1] = element.total
            }else if(element.month == '3'){
                graphData[2] = element.total
            }else if(element.month=='4'){
                graphData[3] = element.total
            }else if(element.month=='5'){
                graphData[4] = element.total
            }else if(element.month=='6'){
                graphData[5] = element.total
            }else if(element.month=='7'){
                graphData[6] = element.total
            }else if(element.month=='8'){
                graphData[7] = element.total
            }else if(element.month=='9'){
                graphData[8] = element.total
            }else if(element.month=='10'){
                graphData[9] = element.total
            }else if(element.month=='11'){
                graphData[10] = element.total
            }else if(element.month=='12'){
                graphData[11] = element.total
            }
        });

        if(indicator == 'LINE'){
            this.drawLineGraph();
            this.drawPolarGraph();
        }


    }

    drawLineGraph=()=>{
        let tempLabel = this.months, today = new Date().getMonth(), finalLabel=[];
        let tempData = this.lineGraphData, finalData=[];
        let tempContributions =this.contributionGraphData, finalContribution=[];
        
        for(let i = 0; i<12; i++){
            finalLabel.push(tempLabel[today]);
            finalData.push(tempData[today]);
            finalContribution.push(tempContributions[today]);
            today--;
            if(today<0){
                today=11;
            }
        }


        this.months = finalLabel.reverse();
        this.lineGraphData= finalData.reverse();
        this.contributionGraphData = finalContribution.reverse();

        this.lineGraph={
            labels:this.months,
            datasets:[
                {
                    label:'Contributors Growth',
                    data:this.lineGraphData,
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                },
                {
                    label:'Contributions ',
                    data:this.contributionGraphData,
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }
            ]
        }
    }

    drawPolarGraph=()=>{
        this.polarGraph = {
            labels: this.months,
            datasets: [{
                label: 'Contributors',
                data: this.lineGraphData,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }, 
            {
                label: 'Contributions',
                data: this.contributionGraphData,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }
        ]
        };
    }
}
