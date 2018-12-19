import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { callNgModuleLifecycle } from '@angular/core/src/view/ng_module';

@Injectable()

export class HttpService {
  headers:any;
  toRunMethod:any;
  constructor(public http: Http) {}
  // manage http calls with login token
  manageHttp(method: any, url: any, body: any, head) {
    if (method === 'get') {
      this.toRunMethod = this.http.get(url, { headers: head });
    } else if (method === 'post') {
      const options = new RequestOptions({ headers: head });
      this.toRunMethod = this.http.post(url, body, options);
    } else if (method === 'put') {
      this.toRunMethod = this.http.put(url, body, { headers: head });
    } else if (method === 'delete') {
      this.toRunMethod = this.http.delete(url, { headers: head });
    }
    return this.toRunMethod.pipe(map((response: Response) => {
      if (response  && response.json()) {
        return response.json();
      }
    }, (error) => {
      console.log(error);
    }));
  };
}



