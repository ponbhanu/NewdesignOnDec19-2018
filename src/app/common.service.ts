import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() { }

  // Returning headers
  getHeaders() {
    var headers = new Headers();
    return headers;
  };

  // returns todays Date
  getTodaysDate() {
    var date = new Date();
    return this.changeDateFormat('fullFormat', date);
  };

  // changes dateformate
  changeDateFormat(type, date) {
    var formatedDate = '';
    if (type === 'fullFormat') {
      formatedDate = date.toLocaleDateString("en-US").replace('/', '-').replace('/', '-');
    } else if (type === 'position') {
      var newDate = date.split('-');
      formatedDate = newDate[1] + '-' + newDate[2] + '-' + newDate[0];
    }
    return formatedDate;
  };

  // Storing or retrieving items in local storage
  manageDataInLocalStorage(type, key, value) {
    if (type === 'store') {
      localStorage.setItem(key, value);
    } else if (type === 'retrieve') {
      console.log(parseInt(localStorage.getItem(key)) + '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      return localStorage.getItem(key);
    } else if (type === 'clear') {
      localStorage.clear();
    }
  };

  // On Choosing files
  onChooseFiles(type, data) {
    var filesData = { 'clFile': [], 'feedBackFile': [], 'files': [] };
    if (data && data.target && data.target.files && data.target.files.length) {
      var totalFiles = data.target.files,
        singleFile = data.target.files[0];
      if (type === 'clauseId') {
        filesData.clFile.push(singleFile);
      } else if (type === 'feedback') {
        filesData.feedBackFile.push(singleFile);
      } else if (type === 'filesUpload') {
        for (var i = 0; i < totalFiles.length; i++) {
          filesData.files.push({ 'id': Math.random(), 'name': totalFiles[i].name, 'size': totalFiles[i].size, 'file': totalFiles[i], 'disableRadio': true });
        }
      }
    }
    return filesData;
  };
}
