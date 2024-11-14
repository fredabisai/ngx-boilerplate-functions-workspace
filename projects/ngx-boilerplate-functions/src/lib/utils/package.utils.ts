import {FormGroup, UntypedFormGroup} from "@angular/forms";

export class PackageUtils {
  static isFormGroup(obj: any): obj is FormGroup {
    return obj instanceof FormGroup;
  }
  static isUntypedFormGroup(obj: any): obj is UntypedFormGroup {
    return obj instanceof UntypedFormGroup;
  }
}
