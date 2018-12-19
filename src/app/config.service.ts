import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  constructor() { }

  getServiceEmitObj() {
    var toEmitObject = {'componentName':'','toasteType':'','toasterMessage':''};
    return toEmitObject;
  };

  getDates(){
    let arr = [{'sno':1,'date':'11-22-2018','count':22},{'sno':2,'date':'11-23-2018','count':14},{'sno':3,'date':'11-24-2018','count':18},
    {'sno':4,'date':'11-27-2018','count':26},{'sno':5,'date':'11-28-2018','count':24},{'sno':6,'date':'11-29-2018','count':28},{'sno':7,'date':'11-30-2018','count':38},
    {'sno':8,'date':'12-01-2018','count':58},{'sno':9,'date':'12-02-2018','count':78},{'sno':10,'date':'12-03-2018','count':58},
    {'sno':11,'date':'12-04-2018','count':58},{'sno':12,'date':'12-05-2018','count':18},{'sno':13,'date':'12-06-2018','count':28},
    {'sno':14,'date':'12-07-2018','count':98}];

    return  arr;
  };
  getDaily(){
    let arr =[{'sno':1,'date':'11-22-2018','count':32},{'sno':2,'date':'11-23-2018','count':21},{'sno':3,'date':'11-24-2018','count':18},
    {'sno':4,'date':'11-25-2018','count':26},{'sno':5,'date':'11-26-2018','count':24},{'sno':6,'date':'11-27-2018','count':28},{'sno':6,'date':'11-28-2018','count':38}];
    return[{}]
  };
  getWeakly(){
    let arr =[{'sno':1,'date':'11-22-2018','count':32},{'sno':2,'date':'11-23-2018','count':21},{'sno':3,'date':'11-24-2018','count':18},
    {'sno':4,'date':'11-25-2018','count':26},{'sno':5,'date':'11-26-2018','count':24},{'sno':6,'date':'11-27-2018','count':28},{'sno':6,'date':'11-28-2018','count':38}];
    
    return[{}]
  };
  getMonthly(){
    let arr =[{'sno':1,'date':'11-22-2018','count':32},{'sno':2,'date':'11-23-2018','count':21},{'sno':3,'date':'11-24-2018','count':18},
    {'sno':4,'date':'11-25-2018','count':26},{'sno':5,'date':'11-26-2018','count':24},{'sno':6,'date':'11-27-2018','count':28},{'sno':6,'date':'11-28-2018','count':38}];
    return[{}]
  };
}
