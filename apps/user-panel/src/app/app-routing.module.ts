import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './containers/layout/layout.component';
import { InvoicesListComponent } from './invoices/invoices-list/invoices-list.component';
import { AuthGuard, LoginComponent } from '@invoice2-team/users';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { InvoiceItemComponent } from './invoices/invoice-item/invoice-item.component';
import { InvoiceItemCopyComponent } from './invoices/invoice-item-copy/invoice-item-copy.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CustomerItemComponent } from './customers/customer-item/customer-item.component';
import { PrintComponent } from './print/print.component';
import { UserItemComponent } from './user/user-item/user-item.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: MainLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'invoices',
                component: InvoicesListComponent
            },
            {
                path: 'invoices/form',
                component: InvoiceItemComponent
            },
            {
                path: 'invoices/form/:id',
                component: InvoiceItemComponent
            },
            {
                path: 'invoices/form/copy/:id',
                component: InvoiceItemCopyComponent
            },
            {
                path: 'customers',
                component: CustomersListComponent
            },
            {
                path: 'customers/form/:id',
                component: CustomerItemComponent
            },
            {
                path: 'customers/form',
                component: CustomerItemComponent
            },
            {
                path: 'print/:id',
                component: PrintComponent
            },
            {
                path: 'user/form',
                component: UserItemComponent
            }
        ]
    },
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
