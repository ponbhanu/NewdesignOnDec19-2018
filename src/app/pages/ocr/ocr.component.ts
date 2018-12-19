import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../common.service';
import { ConfigService } from '../../config.service';
import { subscribeOn } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'ocr-tab',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css'],
  providers: [ConfigService, CommonService]
})
export class OcrComponent {
  // @ViewChild(UploadComponent)
  // private uploadComp: UploadComponent;
  // Initializing the ids
  taskId: any;
  rfpId: any;

  // Initializing the progress bar values
  ocrProgressBarVal: any = 0;
  mlProgressBarVal: any = 0;
  disableDownloadbutton: Boolean;
  // Status objects
  ocrStatusList: any = [{ 'status': 'Split', 'success': false, 'successStatus': false }, { 'status': 'Ocr', 'success': false, 'successStatus': false }, { 'status': 'XmlModel', 'success': false, 'successStatus': false }, { 'status': 'SectionXls', 'success': false, 'successStatus': false }, { 'status': 'LogicalXls', 'success': false, 'successStatus': false }, { 'status': 'CSV', 'success': false, 'successStatus': false }, { 'status': 'Ml', 'success': false, 'successStatus': false }];
  mlStatusList: any = [{ 'status': 'status', 'success': false }];

  constructor(public toasterService: ToasterService, public httpService: HttpService, public commonService: CommonService) {
    this.manageButtonProperty("download", "disabled", true);
    this.disableDownloadbutton = true;
  }

  setOcrStatus() {
    this.ocrStatusList = [{ 'status': 'Split', 'success': false, 'successStatus': false }, { 'status': 'Ocr', 'success': false, 'successStatus': false }, { 'status': 'XmlModel', 'success': false, 'successStatus': false }, { 'status': 'SectionXls', 'success': false, 'successStatus': false }, { 'status': 'LogicalXls', 'success': false, 'successStatus': false }, { 'status': 'CSV', 'success': false, 'successStatus': false }, { 'status': 'Ml', 'success': false, 'successStatus': false }];
    this.mlStatusList = [{ 'status': 'status', 'success': false }];
    this.mlProgressBarVal = 1;
    this.ocrProgressBarVal = 1;
    this.disableDownloadbutton = true;
  }

  // get rfpId from storage 
  getRfpIdFromStorage() {
    return this.rfpId = parseInt(localStorage.getItem('rfpId'));
    if (this.rfpId) {
      // this.triggerOcrApi();
    }
  };

  // Assinging rpfId
  assignRfpId(response) {
    this.rfpId = response.resultObject[0].rfpInputId;
  }
  callLoader(type, val) {
    if (type === 'ocr') {
      this.ocrProgressBarVal = val;
    } else if (type === 'ml') {
      this.mlProgressBarVal = val;
    }
  };
  // Triggering ocr API
  triggerOcrApi() {
    let formData: FormData = new FormData();
    formData.append('Content-Type', 'application/json');
    this.callLoader('ocr', 10);
    this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/split/' + this.getRfpIdFromStorage(), formData, this.commonService.getHeaders())
      .subscribe(response => {
        if (response.resultCode && response.resultCode === 'OK') {
          this.callLoader('ocr', 20);
          this.ocrStatusList[0].success = true;
          this.assignRfpId(response);
          this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/ocr/' + this.rfpId, formData, this.commonService.getHeaders())
            .subscribe(response => {
              if (response.resultCode && response.resultCode === 'OK') {
                this.callLoader('ocr', 30);
                this.ocrStatusList[1].success = true;
                this.assignRfpId(response);
                this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/model/' + this.rfpId, formData, this.commonService.getHeaders())
                  .subscribe(response => {
                    if (response.resultCode && response.resultCode === 'OK') {
                      this.callLoader('ocr', 40);
                      this.ocrStatusList[2].success = true;
                      this.assignRfpId(response);
                      this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/xls/' + this.rfpId, formData, this.commonService.getHeaders())
                        .subscribe(response => {
                          if (response.resultCode && response.resultCode === 'OK') {
                            this.callLoader('ocr', 50);
                            this.ocrStatusList[3].success = true;
                            this.assignRfpId(response);
                            this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/filter1/' + this.rfpId, formData, this.commonService.getHeaders())
                              .subscribe(response => {
                                if (response.resultCode && response.resultCode === 'OK') {
                                  this.callLoader('ocr', 70);
                                  this.ocrStatusList[4].success = true;
                                  this.assignRfpId(response);
                                  this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/csv/' + this.rfpId, formData, this.commonService.getHeaders())
                                    .subscribe(response => {
                                      if (response.resultCode && response.resultCode === 'OK') {
                                        this.callLoader('ocr', 85);
                                        this.ocrStatusList[5].success = true;
                                        this.assignRfpId(response);
                                        this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/ml/' + this.rfpId, formData, this.commonService.getHeaders())
                                          .subscribe(response => {
                                            if (response.resultCode && response.resultCode === 'OK') {
                                              this.taskId = response.resultObject[0].taskId;
                                              this.ocrStatusList[6].success = true;
                                              this.callLoader('ocr', 100);
                                              this.callToasterMessage('success', 'ML status is completed');
                                              this.triggerMlAPi();
                                            } else {
                                              this.ocrStatusList[6].successStatus = true;
                                              if (response.resultCode && response.resultCode === 'KO' && response.message === 'INCORRECT_ML_URL') {
                                                alert('url of ml is not correct');
                                              }
                                              this.callToasterMessage('error', 'Status failed at ml');
                                            }
                                          });
                                        this.callToasterMessage('success', 'csv is completed');
                                      } else {
                                        this.ocrStatusList[5].successStatus = true;
                                        this.callToasterMessage('error', 'Status failed at CSV');
                                      }
                                    });
                                  this.callToasterMessage('success', 'LogicalXls is completed');
                                } else {
                                  this.ocrStatusList[4].successStatus = true;
                                  this.callToasterMessage('error', 'Status failed at LogicalXls');
                                }
                              });
                            this.callToasterMessage('success', 'XmlModel is completed');
                          } else {
                            this.ocrStatusList[3].successStatus = true;
                            if (response.resultCode && response.resultCode === 'KO' && response.message === 'XML_FILE_PARSING_ERROR') {
                              alert('file passing error');
                            }
                          }
                        });
                    } else {
                      this.ocrStatusList[2].successStatus = true;
                      this.callToasterMessage('error', 'Status failed at CSV');
                    }
                  });
              } else {
                this.ocrStatusList[1].successStatus = true;
                if (response.resultCode && response.resultCode === 'KO' && response.resultObject[0].failureReason === 'No Data found for the given inputs') {
                  alert('No Data found for the given inputs');
                }
                this.callToasterMessage('error', 'Status failed at OCR');
              }
            });
        } else {
          this.ocrStatusList[0].successStatus = true;
          if (response.resultCode && response.resultCode === 'KO' && response.message === 'FILE_NOT_AVAILABLE') {
            alert('file is not available');
          }
          this.callToasterMessage('error', 'Status failed at getting Split');
        }
      });
  };

  // Ml status Triggering
  triggerMlAPi() {
    this.callLoader('ml', 5);
    var handle = setInterval(() => {
      this.httpService.manageHttp('get', 'http://13.72.70.226/textclassifier/task/' + this.taskId + '/status', '', this.commonService.getHeaders())
        .subscribe(response => {
          if (response.resultCode && (response.resultCode === 'OK')) {
            this.callLoader('ml', 20);
            if (response.resultObj.status === 'completed') {
              this.taskId = response.resultObj.taskId;
              this.callLoader('ml', 100);
              //this.downloadFile();
              this.mlStatusList[0].success = true;
              this.disableDownloadbutton = false;
              clearInterval(handle);
              alert('file processed successfully');
            }
          } else {
            this.mlStatusList[0].success = false;
            this.taskId = '';
            this.toasterService.pop('error', 'Status failed at getting TaskId');
          }
        });
    }, 2000);
  };



  // Disabling and enabling buttons
  manageButtonProperty(id, property, flag) {
    $('#' + id).prop(property, flag);
  }

  // Download file Triggering
  downloadFile() {
    this.manageButtonProperty("download", "disabled", false);
    this.httpService.manageHttp('get', 'http://icml-docker.cloudapp.net/textclassifier/task/' + this.taskId + '/rfp/status', '', this.commonService.getHeaders())
      .subscribe(response => {
        if (response && (response.resultCode === 'OK')) {
          var file = response.resultObj.outputFiles.excel.url;
          this.downloadFileFromUrl(file, response.resultObj);
          // $('a#download').attr({target: '_blank', 
          //             href  :file});
        } else {
          this.toasterService.pop('error', 'Status failed at getting TaskId');
        }
      });
  };

  downloadFileFromUrl(file: string, res) {

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = file;
    a.download = res.rfp;
    a.click();
    window.URL.revokeObjectURL(file);
    a.remove(); // remove the element

  }





  // Call toaster messages
  callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };
}




