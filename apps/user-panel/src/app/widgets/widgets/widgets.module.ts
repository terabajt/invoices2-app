import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsRoutingModule } from './widgets-routing.module';

import { WidgetsBrandComponent } from './widgets-brand/widgets-brand.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WidgetSummaryOfSalesCircleComponent } from '../widget-summary-of-sales-circle/widget-summary-of-sales-circle.component';

@NgModule({
    declarations: [WidgetsBrandComponent],
    imports: [CommonModule, WidgetsRoutingModule, NgxChartsModule],
    exports: [WidgetsBrandComponent]
})
export class WidgetsModule {}
