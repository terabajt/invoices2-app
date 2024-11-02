import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WidgetsModule } from '../../widgets/widgets/widgets.module';
import {
    AvatarModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    NavModule,
    ProgressModule,
    TableModule,
    TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ReactiveFormsModule } from '@angular/forms';
import { WidgetsComponent } from '../../widgets/widgets/widgets/widgets.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WidgetSummaryOfSalesCircleComponent } from '../../widgets/widget-summary-of-sales-circle/widget-summary-of-sales-circle.component';

@NgModule({
    declarations: [DashboardComponent, WidgetsComponent, WidgetSummaryOfSalesCircleComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        WidgetsModule,
        CardModule,
        NavModule,
        IconModule,
        TabsModule,
        GridModule,
        ProgressModule,
        ReactiveFormsModule,
        ButtonModule,
        FormModule,
        ButtonModule,
        ButtonGroupModule,
        ChartjsModule,
        AvatarModule,
        TableModule,
        NgxChartsModule
    ]
})
export class DashboardModule {}
