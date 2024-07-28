import {Injectable} from "@angular/core";
import {FormControl, FormGroup, UntypedFormGroup, ValidatorFn} from "@angular/forms";
import {VERSION} from "@angular/cli";

@Injectable({
  providedIn: 'root'
})
export class FormsFunctionsService {
  private majorVersion = parseInt(VERSION.major, 10);

  constructor() { }
  setFormFieldsValidations(form: FormGroup | UntypedFormGroup, fields: {name: string, validations: ValidatorFn[]}[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if ( field?.name &&  form?.contains(field.name) && field?.validations?.length) {
          form.get(field.name)!.setValidators(field.validations);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }
  removeFormFieldsValidations(form: FormGroup | UntypedFormGroup, fields: {name: string, defaultValue?: any}[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if (field?.name &&  form?.contains(field.name)) {
          form.get(field.name)!.setErrors(null);
          form.get(field.name)!.clearValidators();
          form.get(field.name)!.patchValue(field?.defaultValue !== null ? field?.defaultValue : null);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }

}
