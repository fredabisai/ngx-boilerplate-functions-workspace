import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";

export class PackageUtils {
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
}
