import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {AdminComponent} from './layout/admin/admin.component';
import {BreadcrumbsComponent} from './layout/admin/breadcrumbs/breadcrumbs.component';
import {TitleComponent} from './layout/admin/title/title.component';
import {AuthComponent} from './layout/auth/auth.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonService} from './app-services/CommonService';
import {RemoteHelper} from './app-services/RemoteHelper';
import {LoaderService} from './app-services/LoaderService';
import {HttpClientModule} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AuthModule} from './pages/auth/auth.module';
import {TabViewModule} from 'primeng/tabview';
import { ContributorComponent } from './layout/contributor/contributor.component';

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        BreadcrumbsComponent,
        TitleComponent,
        AuthComponent,
        ContributorComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        AuthModule,
        TabViewModule,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        CommonService, RemoteHelper, LoaderService, MessageService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
