import { Component } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { ConfigService } from '../../config.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-clauseId',
  templateUrl: './clause-id.component.html',
  styleUrls: ['./clause-id.component.css'],
  providers: [HttpService,ConfigService,CommonService]
})
export class ClauseIdComponent {
  clFile: any = [];
  taskId: any;
  clauseIdProgressBarVal: any = 1;
  isClauseFileUploaded: boolean;
  constructor(public toasterService: ToasterService,public httpService:HttpService,public commonService:CommonService) { 
    this.isClauseFileUploaded = false;
  }

  // On Choosing files
  onChooseFiles(type, data) {
    this.clFile = this.commonService.onChooseFiles(type,data).clFile;
  };
  callLoader(type, val) {
    this.clauseIdProgressBarVal = val;
  };

  // On uploading Clause Id
  onSubmitClauseIdForm() {
    let formData: FormData = new FormData();
    formData.append('file', this.clFile[0]);
    var fileName = this.clFile[0].name,
    body = { 'fileName': fileName };
    this.httpService.manageHttp('post', 'http://icml-docker.cloudapp.net/textclassifier/clause/refresh', formData, this.commonService.getHeaders())
      .subscribe(response => {
        if (response.resultCode && response.resultCode === 'OK') {
          this.isClauseFileUploaded = true;
          this.taskId = response.resultObj.task_id;
          this.callLoader('clauseId',50);
          this.triggerProAPi();
          this.callToasterMessage('success','clauseId file uploaded and processed successfully');
        
        } else {
          this.callToasterMessage('error','clauseId file not uploaded');
        }
      });
  };

  triggerProAPi() {
        var handle = setInterval(() => {
    this.httpService.manageHttp('get', 'http://13.72.70.226/textclassifier/task/' + this.taskId + '/status', '', this.commonService.getHeaders())
      .subscribe(response => {
        if (response.resultCode && (response.resultCode === 'OK')) {
            if(response.resultObj.status === 'completed'){
            this.taskId = response.resultObj.taskId;
                        //this.downloadFile();
            
            clearInterval(handle);
            this.callLoader('clauseId',100);
          }else if(response.resultObj.status === 'error'){
            this.toasterService.pop('error', 'Process Failed');
            clearInterval(handle);
          }
       } else {
          this.taskId = '';
         this.toasterService.pop('error', 'Status failed at getting TaskId');
       }
     });
   }, 2000);
};
   // Call toaster messages
   callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };

}
