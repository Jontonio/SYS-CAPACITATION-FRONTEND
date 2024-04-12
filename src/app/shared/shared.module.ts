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
import { LayoutComponent } from './layout/layout.component';
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


@NgModule({
    imports: [
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,
        ToastrModule.forRoot(),
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
        ShowNumberPipe
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
