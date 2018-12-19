import { Component } from '@angular/core';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';
import { ConfigService } from '../../config.service';
import { ToasterService } from 'angular2-toaster';
import { Headers } from '@angular/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  providers: [HttpService,ConfigService,CommonService]
})
export class FeedbackComponent {
  feedBackFile: any = [];
  feedbackProgressBarVal: any = 1;
  isFeedbackFileUploaded: boolean;
  constructor(public toasterService: ToasterService,public httpService: HttpService,public commonService:CommonService) {
    this.isFeedbackFileUploaded = false;
   }
   callLoader(type, val) {
    this.feedbackProgressBarVal = val;
  };
  // On Choosing files
  onChooseFiles(type, data) {
    this.feedBackFile = this.commonService.onChooseFiles(type,data).feedBackFile;
  };
  
  // Triggers when feedback form is submitted
  onSubmitFeedBackForm() {
    let formData: FormData = new FormData();
    formData.append('file', this.feedBackFile[0]);
    var fileName = this.feedBackFile[0].name,
    body = { 'fileName': fileName };
    this.httpService.manageHttp('post', ' http://icml-docker.cloudapp.net/textclassifier/feedback/upload', formData, this.commonService.getHeaders())
    .subscribe(data =>{
      if(data.resultCode === "OK"){
        this.callLoader('feedback',30);
        this.isFeedbackFileUploaded = true;
        this.callToasterMessage('success', 'Feedback form uploaded successfully');
        this.httpService.manageHttp('post', 'http://icml-docker.cloudapp.net/textclassifier/feedback/process', body, new Headers())
        .subscribe(resp=>{
          if(resp && resp.resultCode === "OK"){
            if(resp.message === 'Task submitted for processing'){
              this.callLoader('feedback',60);
              // WHen user uploads first time ,Upload is completed for processing
              this.callToasterMessage('success', 'file submitted for processing');
            }else{
              var taskId = resp.resultObj.taskId;
              this.callToasterMessage('error', 'Process not completed successfully');
              //Call Task API repeteadlu until process is completed
              let handle = setInterval(()=>{
                this.httpService.manageHttp('get', ' http://13.72.70.226/textclassifier/task/' + taskId + '/status', '', this.commonService.getHeaders())
              .subscribe(rslt=>{
                if(rslt && rslt.resultCode === 'OK'){
                  if(rslt.resultObj.status === 'completed'){
                    //Once completed stop Calling The API
                    clearInterval(handle);
                    this.callLoader('feedback',100);
                    this.callToasterMessage('success', 'Task completed successfully');
                  } 
                }else{
                  this.callToasterMessage('error', 'Task API Failed');
                }
              },
              error=>{
                this.callToasterMessage('error', 'Task API Failed');
              })
              },3000)
            }
            
          }else{
            //Process API Return KO
            this.callToasterMessage('error', 'Process API  error');
          }
        },
        err=>{
          this.callToasterMessage('error', 'There is a model training in progress, please try after sometime..');
        })
      }else{
        //UPLOAD API Gives KO
        this.callToasterMessage('error', 'Failed to upload');
      }
    },
    error=> {
      this.callToasterMessage('error', 'Upload API Failed');
    })
      // .subscribe(response => {
      //   if (response.resultCode && response.resultCode === 'OK') {
      //     this.callToasterMessage('success', 'Feedback form uploaded successfully');
      //     this.httpService.manageHttp('post', 'http://icml-docker.cloudapp.net/textclassifier/feedback/process', body, new Headers())
      //       .subscribe(response => {
      //         if (response.resultCode && response.resultCode === 'OK') {
      //           var taskId = response.resultObj.taskId,
      //           handle = setInterval(() => {
      //           this.httpService.manageHttp('get', ' http://13.72.70.226/textclassifier/task/' + taskId + '/status', '', this.commonService.getHeaders())
      //             .subscribe(response => {
      //               if (response.resultCode && response.resultCode === 'OK') {
      //                 if(response.resultObj.status === 'completed') {
      //                   this.callToasterMessage('success', 'Process completed successfully');
      //                   clearInterval(handle);
      //                 }
      //               } else {
      //                 this.callToasterMessage('error', 'File uploading failed');
      //               }
      //             });
      //           },2000);
      //         } else {
      //           this.callToasterMessage('error', 'Failed to upload');
      //         }
      //       });
      //   } else {
      //     this.callToasterMessage('error', 'Process failed at ml');
      //   }
      // });
  };

   // Call toaster messages
   callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };

}
