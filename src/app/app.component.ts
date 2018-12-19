import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
declare var $: any;

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  timedOut = false;
  // sets inactivity automatic logged off timer here in secounds, For example 1 min = 60 sec.
  setLoggedInactivityTimeOut: number = 900;
  inactivityTimeOutIn: number;
  ticks = 10;
  downloadTimer: any = '';
  timeleft: any;

  constructor(public router: Router, private idle: Idle, private keepalive: Keepalive) {

    this.inactivityTimeOutIn = this.setLoggedInactivityTimeOut / 2;
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(this.inactivityTimeOutIn);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(this.inactivityTimeOutIn);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      if (this.router && this.router.url) {
        if (this.router.url === '/') {
          this.reset();
          return;
        } else {
          this.timeleft = 10;
          this.downloadTimer = setInterval(() => {
            $('#progressBar').value = 10 - --this.timeleft;
            this.ticks = this.timeleft;
            if (this.timeleft <= 0) {
              this.logout();
              clearInterval(this.downloadTimer);
            }
          }, 1000);
          setTimeout(() => {
            $('#timeOutModal').modal('show');
          }, 200);
          this.timedOut = true;
        }
      }
    });

    keepalive.interval(this.inactivityTimeOutIn);

    this.reset();

  }

  ngOnInit() {
    //this.getCurrentFileCount();
  }


  // reset timer for user inactivity
  reset() {
    this.idle.watch();
    this.timedOut = false;
    if (this.ticks && this.ticks >= 0) {
      setTimeout(() => {
        clearInterval(this.downloadTimer);
        $('#timeOutModal').modal('hide');
        this.ticks = 10;
      }, 200);
    }
  }

  // logout and redirect to login page
  logout() {
    this.reset();
    setTimeout(() => {
      $('#timeOutModal').modal('hide');
      this.router.navigate(['/']);
    }, 200);
  }

}
