import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AnalyticsOnDateComponent } from '../pages/analytics-on-date/analytics-on-date.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AnalyticsComponent } from '../pages/analytics/analytics.component';
import { ClauseIdComponent } from '../pages/clause-id/clause-id.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            }, {
                path: 'analytics',
                component: AnalyticsComponent,
            }, {
                path: 'clauseId',
                component: ClauseIdComponent,
            }, {
                path: 'feedback',
                component: FeedbackComponent,
            },
            {
                path: 'analytics-on-date/:date',
                component: AnalyticsOnDateComponent,
            }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);