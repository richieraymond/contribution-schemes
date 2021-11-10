import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';
import {ToggleFullScreenDirective} from './fullscreen/toggle-fullscreen.directive';
import {CardRefreshDirective} from './card/card-refresh.directive';
import {CardToggleDirective} from './card/card-toggle.directive';
import {SpinnerComponent} from './spinner/spinner.component';
import {CardComponent} from './card/card.component';
import {ModalAnimationComponent} from './modal-animation/modal-animation.component';
import {ModalBasicComponent} from './modal-basic/modal-basic.component';
import {DataFilterPipe} from './element/data-filter.pipe';
import {MenuItems} from './menu-items/menu-items';
import {ParentRemoveDirective} from './element/parent-remove.directive';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ClickOutsideModule} from 'ng-click-outside';
import {LinkTriggerDirective} from '../layout/admin/admin.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {SkeletonModule} from 'primeng/skeleton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BlockUIModule} from 'primeng/blockui';
import {TabMenuModule} from 'primeng/tabmenu';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {PickListModule} from 'primeng/picklist';
import {CheckboxModule} from 'primeng/checkbox';
import {LoggedInGuard} from '../pages/auth/guards/logged-in.guard';
import {ManageAdminGuard} from '../pages/auth/guards/manage-admin.guard';
import {ManageRoleGuard} from '../pages/auth/guards/manage-role.guard';
import {ManageUserGuard} from '../pages/auth/guards/manage-user.guard';
import {TabViewModule} from 'primeng/tabview';
import {LoaderComponent} from './loader/loader.component';
import {GMapModule} from 'primeng/gmap';
import {CommonComponent} from '../app-services/CommonComponent';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {ManageSchemeGuard} from '../pages/auth/guards/manage-scheme.guard';
import {StepsModule} from 'primeng/steps';

const primeNgModules = [
    MessagesModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CalendarModule,
    InputMaskModule,
    InputNumberModule,
    DropdownModule,
    RadioButtonModule,
    MultiSelectModule,
    InputTextareaModule,
    CardModule,
    TagModule,
    SkeletonModule,
    ProgressSpinnerModule,
    BlockUIModule,
    TabMenuModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    TableModule,
    PickListModule,
    CheckboxModule,
    TabViewModule,
    GMapModule,
    FileUploadModule,
    HttpClientModule,
    StepsModule
];
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        ClickOutsideModule,
        NgbModule,
        primeNgModules,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        ToggleFullScreenDirective,
        LinkTriggerDirective,
        CardRefreshDirective,
        CardToggleDirective,
        SpinnerComponent,
        CardComponent,
        ModalAnimationComponent,
        ModalBasicComponent,
        DataFilterPipe,
        ParentRemoveDirective,
        LoaderComponent,
        CommonComponent
    ],
    exports: [
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        ToggleFullScreenDirective,
        LinkTriggerDirective,
        CardRefreshDirective,
        CardToggleDirective,
        SpinnerComponent,
        CardComponent,
        ModalAnimationComponent,
        ModalBasicComponent,
        DataFilterPipe,
        ParentRemoveDirective,
        NgbModule,
        PerfectScrollbarModule,
        ClickOutsideModule,
        primeNgModules,
        ReactiveFormsModule,
        FormsModule,
        LoaderComponent,
        CommonComponent
    ],
    providers: [
        MenuItems,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        LoggedInGuard,
        ManageAdminGuard,
        ManageSchemeGuard,
        ManageRoleGuard,
        ManageUserGuard,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
}
