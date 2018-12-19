import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../config.service';
import { CommonService } from '../../common.service';
@Component({
  selector: 'app-analytics-on-date',
  templateUrl: './analytics-on-date.component.html',
  styleUrls: ['./analytics-on-date.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsOnDateComponent implements OnInit {
  analyticsData: any[];
  fromDate: any;
  toDate: any;
  dates: any = { 'fromDate': '', 'toDate': '' };
  events: any = [];
  isShowResetButton: any = false;
  options: any = [];
  analyticsOnDate: any;

  constructor(
    public configService: ConfigService,
    public commonService: CommonService,
    activatedroute: ActivatedRoute

  ) {
    activatedroute.params.subscribe(p => { this.analyticsOnDate = p['date'] });
  }

  ngOnInit() {
    this.loadDates();
  }

  loadDates() {
    this.isShowResetButton = false;
    this.analyticsData = this.configService.getDates();
  };

  onSelectDate(type) {
    if (type === 'from') {
      this.fromDate = this.commonService.changeDateFormat('position', this.dates.fromDate);
    } else if (type === 'to') {
      this.toDate = this.commonService.changeDateFormat('position', this.dates.toDate);
    }
  };


  onSearchByDates() {
    this.analyticsData = [];
    this.analyticsData = this.configService.getDates().filter(m => new Date(m.date) >= new Date(this.fromDate) && new Date(m.date) <= new Date(this.toDate));
    this.isShowResetButton = true;
  };

  onReset() {
    this.loadDates();
  };
}