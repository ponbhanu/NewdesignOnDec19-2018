import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ConfigService } from '../../config.service';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { ToasterService } from 'angular2-toaster';
import { OcrComponent } from '../ocr/ocr.component';
import { Headers } from '@angular/http';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [HttpService, ConfigService, CommonService]
})
export class UploadComponent implements OnInit {
  @ViewChild(OcrComponent) private _ocrComponent: OcrComponent;
  @ViewChild('myfileInput')
  myInputVariable: ElementRef;

  ngOnInit() {
    var rfpId = parseInt(localStorage.getItem('rfpId'));
    if (rfpId) {
      this._ocrComponent.triggerOcrApi();
    }
  };

  // Initializing files storing variables
  files: any = [];
  newFiles: any = [];
  selectedFiles: any = [];

  // Initializing Id's
  taskId: any;
  rfpId: any;
  lotNumber: any;
  uploadDone: any;

  // Initializing progress bar value
  uploaderProgressBarVal: any = 0;


  // Initializing radio button status
  isRadioClicked: any = false;
  fileUploadingStatus: any = '';

  // Initializing tabs
  ocrTab: any = true;
  mlTab: any = true;
  fileUploadTab: any = true;
  clauseIdTab: any = false;
  feedBackTab: any = false;
  analyticsTab: any = false;
  configServiceObj: any = {};
  ocrStatusList: any = [{ 'status': 'split', 'success': false }, { 'status': 'ocr', 'success': false }, { 'status': 'model', 'success': false }, { 'status': 'xls', 'success': false }, { 'status': 'filter1', 'success': false }, { 'status': 'csv', 'success': false }, { 'status': 'ml', 'success': false }];
  mlStatusList: any = [{ 'status': 'status', 'success': false }];
  disableUploadbutton: boolean;
  cancelUpload: Subscription;
  disablecancelButton: boolean;
  disablechoosefile: boolean;
  selectedEntry;

  constructor(public configService: ConfigService, public toasterService: ToasterService, public httpService: HttpService, public commonService: CommonService) {
    this.commonService.manageDataInLocalStorage('clear', '', '');
    this.disableUploadbutton = true;
    this.disablecancelButton = true;
    this.disablechoosefile = false;

  }

  // On Choosing files
  onChooseFiles(type, data) {
    // this.resetFiles();
    this.newFiles = this.commonService.onChooseFiles(type, data).files;
    if (this.files && this.files.length > 0 && this.newFiles) {
      for (var i = 0; i < this.newFiles.length; i++) {
        this.files.push(this.newFiles[i]);
      }
    } else {
      this.files = this.newFiles;
    }
    if (this.files && this.files.length > 0) {
      for (var j = 0; j < this.files.length; j++) {
        this.files[j].number = 1 + j;

        // added on dec 18
        if (this.files[j].number === 1) {
          this.isRadioClicked = true;
          this.files[j].isPrimary = true;
          this.files[j].disableRadio = null;
        } else {
          this.files[j].isPrimary = false;
          this.files[j].disableRadio = true;
        }

      }
    }
    this.selectedFiles = this.files;
    this.uploaderProgressBarVal = 0;
    this._ocrComponent.setOcrStatus();
    this.fileUploadingStatus = '';
    this.disableUploadbutton = false;
  };

  // Empty all files array
  resetFiles() {
    this.files = [];
    this.selectedFiles = [];
  }

  // On click radio butto 
  onSelectPrimaryFile(data) {
    this.isRadioClicked = true;
    this.selectedEntry = data.file;
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i].id === data.id) {
        this.files[i].isPrimary = true;
      } else {
        this.files[i].isPrimary = false;
      }
    }
  };

  // On select to upload file
  // onSelectFilesToUpload(evt,file) {
  //         if(evt.target.checked){
  //       //Enabling the radio button
  //       file.disableRadio =null;
  //       file.isSelected =true;
  //       //console.log( this.selectedEntry);
  //       if(this.selectedEntry && this.selectedEntry.name === file.name){
  //         file.isPrimary = true;
  //       }
  //       this.selectedFiles.push(file);
  //     }else{
  //       //disabling the radio button when select button is unchecked 
  //       file.disableRadio =true;
  //       file.isSelected =false;
  //       let index = this.files.indexOf(file);
  //       //console.log(index);
  //       this.files[index].isPrimary =false;
  //       this.selectedFiles.splice(this.selectedFiles.indexOf(file) , 1);
  //     }

  //  // }
  // };

  // To delete a file
  onDeleteFile(id) {
    this.files = this.files.filter((item) => item.id !== id);

    // added on 17 dec
    if (this.files && this.files.length > 0) {
      for (var j = 0; j < this.files.length; j++) {
        this.files[j].number = 1 + j;
      }
      this.disableUploadbutton = false;
    } else {
      this.files = [];
      this.myInputVariable.nativeElement.value = "";
      this.disableUploadbutton = true;
    }
  };

  // Preparing the selected files list
  prepareFilesToUpload() {
    var filesToUpload = [];
    let formData: FormData = new FormData();
    for (var i = 0; i < this.selectedFiles.length; i++) {
      filesToUpload.push(this.selectedFiles[i].file);
    }
    for (var i = 0; i < filesToUpload.length; i++) {
      formData.append('file', filesToUpload[i]);
    }
    return formData;
  };

  // Creating headers with primary file name
  appendPrimaryFileNameToHeader() {
    var headers = this.commonService.getHeaders(),
      toReturnObj = { 'headers': '' };
    return headers;
  };

  // Setting individual status for files
  setIndividualFileStatus(status) {
    for (var j = 0; j < this.files.length; j++) {
      this.files[j].status = status;
    }
  };

  // Disabling and enabling buttons
  manageButtonProperty(id, property, flag) {
    $('#' + id).prop(property, flag);
  }

  callLoader(type, val) {
    this.uploaderProgressBarVal = val;
  };


  // For uploading files
  onClickUploadAllFiles() {
    this.fileUploadingStatus = '';
    var filesToUpload = [],
      headers,
      files;
    if (!this.selectedFiles && (this.selectedFiles.length === 0)) {
      this.callToasterMessage('error', 'Please select files to upload');
      return;
    }
    if (!this.isRadioClicked) {
      this.callToasterMessage('error', 'Please select the primary file');
      return;
    }
    headers = new Headers();
    for (var k = 0; k < this.files.length; k++) {
      if (this.files[k].isPrimary) {
        if (this.selectedFiles.indexOf(this.files[k]) > -1) {
          headers.append('primary', this.files[k].name);
          k = this.files.length;
        } else {
          this.callToasterMessage('error', 'Primary file must be a selected file');
          return;
        }
      } else {
        if (k === this.files.length - 1) {
          this.callToasterMessage('error', 'Please select a primary file');
          return;
        }
      }
    }
    this.fileUploadingStatus = 'File Uploading Started.....';
    var formData = this.prepareFilesToUpload();
    localStorage.clear();
    this.callLoader('upload', 30);
    this.triggerFileUploadApi(formData, headers);
    this.disableUploadbutton = true;
    this.resetFiles();
    // this.manageButtonProperty('filesUpload', 'disabled', true);
    // this.manageButtonProperty('uploadAll', 'disabled', true);
  };

  // Triggering the file upload API
  triggerFileUploadApi(formData, headers) {
    this.fileUploadingStatus = 'File Upload Processing.....';
    //const options = new RequestOptions({ headers: headers });
    this.disablecancelButton = false;
    this.cancelUpload = this.httpService.manageHttp('post', 'http://localhost:3000/api/users/upload/', formData, headers)
      // this.cancelUpload = this.httpService.manageHttp('post', 'http://104.211.60.4222/rfp/ic/yankees/upload/', formData, headers)
      .subscribe(response => {
        if (response.resultCode && (response.resultCode === 'OK')) {
          this.lotNumber = response.resultObject[0].lotNumber;
          this.fileUploadingStatus = 'File Uploaded Successfully!';
          this.onFileUploadResult('success');
          this.disablecancelButton = true;
          this.assignRfpId(response);
          this.selectedFiles = [];
          // this.callToasterMessage('success', 'All files uploaded successfully');
          alert('file uploaded successfully');
          this.disableUploadbutton = false;
          this.callLoader('upload', 100);
          setTimeout(() => {
            this.ngOnInit();
          }, 3000);
        }
        else
          if (response.resultCode && response.resultCode === 'KO') {
            if (response.message === 'Invalid File Format/Only PDF formats accepted') {
              alert('Only PDF Formats of RFP are accepted');
            }
            if (response.message === 'FileUploadException') {
              alert('Error while Uploading the file');
            }
            if (response.message === 'DATABASE_ERROR') {
              alert('Error while DataSource Configuring');
            }
            if (response.resultObject[0].failureReason === 'PDF file has protected password') {
              alert('Error while uploading the  PDF file');
            }

            if (response.resultObject[0].failureReason === 'Azure Storage Error') {
              alert('Error while file storing in Azure');
            }

            this.fileUploadingStatus = 'File Upload Failed!';
            this.setIndividualFileStatus('file');
            this.onFileUploadResult('fail');
            this.callToasterMessage('error', 'Files uploading has been stopped');
            this.disableUploadbutton = false;
            this.disablecancelButton = true;
            // this.manageButtonProperty('filesUpload', 'disabled', false);
            // this.manageButtonProperty('uploadAll', 'disabled', false);
          }
      });
  };

  onFileUploadResult(type) {
    this.callLoader('upload', 65);
    this.setIndividualFileStatus(type);
    //this.triggerLotApi();
    // this.manageButtonProperty('filesUpload', 'disabled', false);
    // this.manageButtonProperty('uploadAll', 'disabled', true);
  };

  assignRfpId(response) {
    this.rfpId = '';
    this.rfpId = response.resultObject[0].rfpInputId;
    this.commonService.manageDataInLocalStorage('store', 'rfpId', this.rfpId.toString());
  };

  // Triggering lot number related API
  // triggerLotApi() {
  //   let formData: FormData = new FormData();
  //   this.httpService.manageHttp('post', 'http://104.211.60.4222:8080/rfp/ic/yankees/store/' + this.lotNumber, formData, this.commonService.getHeaders())
  //     .subscribe(response => {
  //       if (response.resultCode && (response.resultCode === 'OK')) {
  //         this.assignRfpId(response);
  //         this.selectedFiles = [];
  //         this.callToasterMessage('success', 'All files uploaded successfully');
  //         this.disableUploadbutton = false;
  //         this.callLoader('upload', 100);
  //         setTimeout(()=>{
  //           this.ngOnInit();
  //        }, 3000);    
  //       } else {
  //         this.callToasterMessage('error', 'Failed at generating rfpId'); 
  //       }
  //     });
  // };

  // Empty all files array
  emptyFiles() {
    this.files = [];
    this.selectedFiles = [];
  };

  // To reset selected files
  cancel() {
    // Code to cancel Upload API call
    if (this.cancelUpload && !this.cancelUpload.closed) {
      this.uploaderProgressBarVal = 0;
      this.cancelUpload.unsubscribe();
      this.fileUploadingStatus = '';
      this.disableUploadbutton = false;
      this.disablecancelButton = !this.disablecancelButton;
    }
    // added on 17 dec
    else {
      this.disableUploadbutton = true;
    }
    this.files = [];
    this.myInputVariable.nativeElement.value = "";
  };

  // Call toaster messages
  callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };

}
