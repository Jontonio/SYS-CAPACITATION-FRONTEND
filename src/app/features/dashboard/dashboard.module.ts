import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { HorizontalBarChartComponent } from './components/horizontal-bar-chart/horizontal-bar-chart.component';
import { CardNumberChartComponent } from './components/card-number-chart/card-number-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { VerticalBarChartComponent } from './components/vertical-bar-chart/vertical-bar-chart.component';
import { ModalSearchProjectComponent } from './components/modal-search-project/modal-search-project.component';

@NgModule({
    declarations: [DashboardHomeComponent, PieChartComponent, HorizontalBarChartComponent, CardNumberChartComponent, LineChartComponent, VerticalBarChartComponent, ModalSearchProjectComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxChartsModule,
        SharedModule
    ]
})
export class DashboardModule { }
