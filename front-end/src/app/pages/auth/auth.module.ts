import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule,
        RouterModule,
    ],
    exports: [
        LoginComponent
    ],
    declarations: [
        LoginComponent,
        AdminLoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ]
})
export class AuthModule {
}
