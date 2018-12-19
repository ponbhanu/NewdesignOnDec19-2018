import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';
declare var $: any;

@Component({
  selector: 'az-pages',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  // Initializing tabs
  ocrTab: any = false;
  mlTab: any = false;
  fileUploadTab: any = true;
  clauseIdTab: any = false;
  feedBackTab: any = false;
  analyticsTab: any = false;
  datesList;
  count;

  // Initializing date variable
  currentFileCount: any = 9;
  weeklyFileCount: any = 30;
  monthlyFileCount: any = 120;

  constructor(
    public toasterService: ToasterService,
    public configService: ConfigService,
    public commonService: CommonService
  ) {

  }

  ngOnInit() {
    //this.getCurrentFileCount();
  }

  // getTodaysFileCount 
  getCurrentFileCount() {
    var currentDate = this.commonService.getTodaysDate();
    var datesList = (this.configService.getDates());
    function daysCount(element) {
      if (element.date === currentDate)
        return element;
    }
    var count = datesList.filter(daysCount);
    this.currentFileCount = count.length > 0 ? count[0].count : 0;
  };

  // Call toaster messages
  callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };

  // Manages tabs
  onClickTabs(tabId) {
    this.clauseIdTab = false;
    this.fileUploadTab = false;
    this.feedBackTab = false;
    this.analyticsTab = false;

    var tabsArr = ['fileUploadTab', 'ocrTab', 'clauseIdTab', 'feedBackTab', 'analyticsTab'],
      index = tabsArr.indexOf(tabId);
    tabsArr.splice(index, 1);
    for (var i = 0; i < tabsArr.length; i++) {
      $('#' + tabsArr[i]).removeClass('tabsBgColor');
    };
    $('#' + tabId).addClass('tabsBgColor');
    if (tabId === 'fileUploadTab') {
      this.fileUploadTab = true;
    } else if (tabId === 'ocrTab') {
      this.ocrTab = true;
    } else if (tabId === 'clauseIdTab') {
      this.clauseIdTab = true;
    } else if (tabId === 'feedBackTab') {
      this.feedBackTab = true;

    } else if (tabId === 'analyticsTab') {
      this.analyticsTab = true;
    }
  };


}

