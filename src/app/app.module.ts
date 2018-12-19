import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { ProgressBarModule } from "ngx-progress-bar";
import { DatePipe } from '@angular/common';
import { CommonService } from './common.service';
import { ConfigService } from './config.service';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    ProgressBarModule,
    TooltipModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ToasterModule.forRoot(),
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [HttpService, DatePipe, ConfigService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
