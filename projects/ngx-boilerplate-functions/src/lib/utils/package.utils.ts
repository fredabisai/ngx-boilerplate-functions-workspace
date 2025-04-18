import {DatePipe} from "@angular/common";

export class PackageUtils {
  private static datePipe: DatePipe;
  constructor() {
  }
  // static isFormGroup(obj: any): obj is FormGroup {
  //   return obj instanceof FormGroup;
  // }
  // static isUntypedFormGroup(obj: any): obj is UntypedFormGroup {
  //   return obj instanceof UntypedFormGroup;
  // }
  // static isFormBuilder(obj: any): obj is FormBuilder {
  //   return obj instanceof FormBuilder;
  // }
  // static isUntypedFormBuilder(obj: any): obj is UntypedFormBuilder {
  //   return obj instanceof UntypedFormBuilder;
  // }
  // static isFormControl(obj: any): obj is FormControl {
  //   return obj instanceof FormControl;
  // }
  // static isUntypedFormControl(obj: any): obj is UntypedFormControl {
  //   return obj instanceof UntypedFormControl;
  // }
  static removeKeyFromObject(obj: any, key: string): any {
    if(obj.hasOwnProperty(key)) {
      const {[key]: [], ...newObj} = obj;
      return newObj;
    }
    return obj;
  }
  static convertToString(obj: any, name: string): any {
    if(obj?.hasOwnProperty(name)) {
      if (typeof obj[name] === 'string') {
        obj[name] = obj[name];
      } else if (typeof obj[name] === 'object') {
        obj = {...obj, [name]: JSON.stringify(obj[name])};
      } else {
        obj = {...obj, [name]: `${obj[name]}`};
      }
    }
    return obj;
  }
  static formatDate(obj: any, name: string | undefined, format: string | undefined): any {
    try {
      if (obj?.hasOwnProperty(name) && name && format) {
        obj = {...obj, [name]: this.datePipe.transform(obj[name], format)};
      }
      return obj;
    } catch (e: any) {
      throw new Error(`Unable to format date format :: ${e?.message}`);
    }
  }
  static convertToNumber(obj: any, name: string) {
    if(obj?.hasOwnProperty(name) && name && /\d/.test(obj[name])) {
      obj = {...obj, [name]: parseInt(obj[name], 10)};
    }
    return obj;
  }
  static convertToFloat(obj: any, name: string) {
    if(obj?.hasOwnProperty(name) && name && /\d/.test(obj[name])) {
      obj = {...obj, [name]: parseFloat(obj[name])};
    }
    return obj;
  }
  static convertToBoolean(obj: any, name: string) {
    if(obj?.hasOwnProperty(name) && name) {
      if(typeof obj[name] === 'boolean') {
        obj = {...obj, [name]: obj[name]};
      } else if(obj[name]) {
        obj = {...obj, [name]: true};
      } else {
        obj = {...obj, [name]: false};
      }
    }
    return obj;
  }
  static addFieldToObject(obj: any, name: string, value: any): any {
    if(!obj || !name || typeof obj !== 'object') {
      return obj;
    }
    return {...obj, [name]: value};
  }

}
