import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { LimitToPipe } from './pipes/limit-to.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ContentPlaceholderAnimationComponent } from './content-placeholder-animation/content-placeholder-animation.component';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { LayoutComponent } from '../features/main/layout/layout.component';
import { InputSearchComponent } from './input-search/input-search.component';
import { ShowFileComponent } from './show-file/show-file.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerComponent } from './ngx-spinner/ngx-spinner.component';
import { MessageTableComponent } from './message-table/message-table.component';

import { ToastrModule } from 'ngx-toastr';
import { SpinnerLoaddingComponent } from './spinner-loadding/spinner-loadding.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { FieldEmptyPipe } from './pipes/field-empty.pipe';
import { ShowNumberPipe } from './pipes/show-number.pipe';
import { LineChartComponent } from "./line-chart/line-chart.component";
import { PieChartComponent } from "./reports/pie-chart/pie-chart.component";
import { HorizontalBarChartComponent } from "./reports/horizontal-bar-chart/horizontal-bar-chart.component";
import { VerticalBarChartComponent } from "./reports/vertical-bar-chart/vertical-bar-chart.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CardProjectComponent } from "./card-project/card-project.component";
import { FormEventComponent } from "./projects/form-event/form-event.component";
import { BtnActionsEventComponent } from "./projects/btn-actions-event/btn-actions-event.component";
import { FormFacilitatorComponent } from "./facilitator/form-facilitator/form-facilitator.component";
import { ModalEvidenceComponent } from './modal-evidence/modal-evidence.component';
import { FirstLetterCapitalizePipe } from './pipes/first-letter-capitalize.pipe';


@NgModule({
    imports: [
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,
        ToastrModule.forRoot(),
        NgxChartsModule
    ],
    declarations: [
        ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LimitToPipe,
        LocalDatePipe,
        YesNoPipe,
        SafeUrlPipe,
        LayoutComponent,
        InputSearchComponent,
        ShowFileComponent,
        NgxSpinnerComponent,
        MessageTableComponent,
        SpinnerLoaddingComponent,
        SkeletonComponent,
        FieldEmptyPipe,
        ShowNumberPipe,
        LineChartComponent,
        PieChartComponent,
        HorizontalBarChartComponent,
        VerticalBarChartComponent,
        CardProjectComponent,
        FormEventComponent,
        BtnActionsEventComponent,
        FormFacilitatorComponent,
        ModalEvidenceComponent,
        FirstLetterCapitalizePipe
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,
        CustomMaterialModule,
        LimitToPipe,
        ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LocalDatePipe,
        YesNoPipe,
        InputSearchComponent,
        NgxSpinnerComponent,
        MessageTableComponent,
        SpinnerLoaddingComponent,
        SkeletonComponent,
        FieldEmptyPipe,
        ShowNumberPipe,
        LineChartComponent,
        PieChartComponent,
        HorizontalBarChartComponent,
        VerticalBarChartComponent,
        CardProjectComponent,
        FormEventComponent,
        BtnActionsEventComponent,
        FormFacilitatorComponent,
        ModalEvidenceComponent,
        FirstLetterCapitalizePipe
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
