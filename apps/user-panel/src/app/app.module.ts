import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

//LOCALE
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers

import {
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    NavModule,
    ProgressModule,
    SharedModule,
    SidebarModule,
    TabsModule,
    UtilitiesModule,
    WidgetModule
} from '@coreui/angular';

//Import Angular Material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';

const MAT_DIALOG_GLOBAL_CONFIG: MatDialogConfig = {
    width: '700px',
    disableClose: true,
    hasBackdrop: true
};

const MAT_SNACK_BAR_GLOBAL_CONFIG: MatSnackBarConfig = {
    duration: 2500,
    verticalPosition: 'bottom',
    horizontalPosition: 'right'
};

const MATERIAL_MODULE = [
    MatSlideToggleModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatCheckboxModule,
    MatGridListModule,
    MatSidenavModule
];

import { InvoicesListComponent } from './invoices/invoices-list/invoices-list.component';

import { MainFooterComponent } from './containers/layout/footer/footer.component';
import { MainHeaderComponent } from './containers/layout/header/header.component';
import { MainLayoutComponent } from './containers/layout/layout.component';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor, UsersModule, UsersService } from '@invoice2-team/users';
import { InvoicesModule } from '@invoice2-team/invoices';
import { DialogComponent } from './shared/dialog/dialog.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { InvoiceItemComponent } from './invoices/invoice-item/invoice-item.component';
import { ButtonAddNewClientComponent } from './invoices/invoice-item/button-add-new-client/button-add-new-client.component';
import { InvoiceItemCopyComponent } from './invoices/invoice-item-copy/invoice-item-copy.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CustomerItemComponent } from './customers/customer-item/customer-item.component';
import { PrintComponent } from './print/print.component';
import { UserItemComponent } from './user/user-item/user-item.component';

const APP_CONTAINERS = [MainFooterComponent, MainHeaderComponent, MainLayoutComponent, InvoicesListComponent];

@NgModule({
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        DialogComponent,
        InvoiceItemComponent,
        ButtonAddNewClientComponent,
        InvoiceItemCopyComponent,
        CustomersListComponent,
        CustomerItemComponent,
        PrintComponent,
        UserItemComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientModule,
        AppRoutingModule,
        AvatarModule,
        BreadcrumbModule,
        FooterModule,
        DropdownModule,
        GridModule,
        HeaderModule,
        SidebarModule,
        IconModule,
        NavModule,
        ButtonModule,
        FormModule,
        UtilitiesModule,
        ButtonGroupModule,
        ReactiveFormsModule,
        SidebarModule,
        SharedModule,
        TabsModule,
        ListGroupModule,
        ProgressModule,
        BadgeModule,
        ListGroupModule,
        CardModule,
        NgScrollbarModule,
        ...MATERIAL_MODULE,
        UsersModule,
        InvoicesModule
    ],
    providers: [
        IconSetService,
        Title,
        { provide: LOCALE_ID, useValue: 'pl-PL' },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'PLN' },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: MAT_DIALOG_GLOBAL_CONFIG },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: MAT_SNACK_BAR_GLOBAL_CONFIG },
        UsersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
