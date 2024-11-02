import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from '@invoice2-team/users';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {
            title: $localize`Dashboard`
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
