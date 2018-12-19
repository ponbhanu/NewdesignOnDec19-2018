import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TooltipModule } from 'ng2-tooltip-directive';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { ProgressBarModule } from "ngx-progress-bar";
import { OcrComponent } from '../pages/ocr/ocr.component';
import { UploadComponent } from '../pages/upload/upload.component';
import { AnalyticsComponent } from '../pages/analytics/analytics.component';
import { ClauseIdComponent } from '../pages/clause-id/clause-id.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AnalyticsOnDateComponent } from '../pages/analytics-on-date/analytics-on-date.component';
import { routing } from './pages.routing';
import { PagesComponent } from './pages.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        ProgressBarModule,
        TooltipModule,
        TableModule,
        CalendarModule,
        FormsModule,
        routing,
        ToasterModule.forRoot()
    ],
    declarations: [
        DashboardComponent,
        PagesComponent,
        OcrComponent,
        UploadComponent,
        AnalyticsComponent,
        ClauseIdComponent,
        FeedbackComponent,
        AnalyticsOnDateComponent
    ]
})
export class PagesModule { }
