import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

export class PackageUtils {
  private static datePipe: DatePipe;
  constructor() {
  }
  static isFormGroup(obj: any): obj is FormGroup {
    return obj instanceof FormGroup;
  }
  static isUntypedFormGroup(obj: any): obj is UntypedFormGroup {
    return obj instanceof UntypedFormGroup;
  }
  static isFormBuilder(obj: any): obj is FormBuilder {
    return obj instanceof FormBuilder;
  }
  static isUntypedFormBuilder(obj: any): obj is UntypedFormBuilder {
    return obj instanceof UntypedFormBuilder;
  }
  static removeKeyFromObject(obj: any, key: string): any {
    if(obj.hasOwnProperty(key)) {
      const {[key]: [], ...newObj} = obj;
      return newObj;
    }
    return obj;
  }

}
