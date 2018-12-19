import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService, CommonService]
})
export class LoginComponent implements OnInit {
  loginform: any = { 'username': '', 'password': '' };

  constructor(public router: Router, public toasterService: ToasterService, public httpService: HttpService, public commonService: CommonService) {

  }

  ngOnInit() {
  }

  login(data) {
    if (!data.username && !data.password) {
      this.callToasterMessage('error', 'Username and password are required');
    } else if (!data.username) {
      this.callToasterMessage('error', 'Username is required');
    } else if (!data.password) {
      this.callToasterMessage('error', 'Password is required');
    } else {
      // added on 17 dec
      if (this.checkMockLoginCredentials(data)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.callToasterMessage('error', 'Invalid Username or password');
      }
      // this.router.navigate(['/', 'red-pill']);
      // this.httpService.manageHttp('post', 'http://104.211.60.4222:8080/' + form.value, form.value, this.commonService.getHeaders())
      //   .subscribe(response => {
      //     if (response.resultCode && (response.resultCode === 'OK')) {

      //     } else {
      //       this.callToasterMessage('error', 'Failed at generating rfpId');
      //     }
      //   });
    }
  }

  // added on 17 dec
  checkMockLoginCredentials(loginCredentials) {
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin1234') {
      return true;
    } else {
      return false;
    }
  };

  // Call toaster messages
  callToasterMessage(type, message) {
    this.toasterService.pop(type, message);
  };

}
