import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import { ConfigService } from '../../config.service';
import { CommonService } from '../../common.service';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnInit {
  analyticsData:any [];
  fromDate:any;
  toDate:any;
  dates:any = {'fromDate':'','toDate':''};
  events:any = [];
  isShowResetButton:any = false;
  options:any = [];
  constructor(
    public configService:ConfigService,
    public commonService:CommonService
    
    ) {
      
  } 
  
  ngOnInit(){
    this.loadDates();
  }

  loadDates() {
  this.isShowResetButton = false;
      this.analyticsData = this.configService.getDates(); 
  };
 
  onSelectDate(type) {
    if (type === 'from') {
      this.fromDate = this.commonService.changeDateFormat('position',this.dates.fromDate);
    } else if (type === 'to') {
      this.toDate = this.commonService.changeDateFormat('position',this.dates.toDate);
    }
  };

  
   onSearchByDates(){
    this.analyticsData  = [];
    this.analyticsData = this.configService.getDates().filter(m => new Date(m.date) >= new Date(this.fromDate) && new Date(m.date) <= new Date(this.toDate));
    this.isShowResetButton = true;   
   };

   onReset() {
       this.loadDates();
   };
}