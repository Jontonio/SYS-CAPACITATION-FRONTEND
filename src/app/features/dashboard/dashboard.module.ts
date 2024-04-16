import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CardNumberChartComponent } from './components/card-number-chart/card-number-chart.component';
import { ModalSearchProjectComponent } from './components/modal-search-project/modal-search-project.component';

@NgModule({
    declarations: [
        DashboardHomeComponent, 
        CardNumberChartComponent, 
        ModalSearchProjectComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedModule
    ]
})
export class DashboardModule { }
