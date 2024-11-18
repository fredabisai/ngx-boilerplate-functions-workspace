import {Injectable} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup, ValidationErrors,
  ValidatorFn
} from "@angular/forms";
import {VERSION} from "@angular/cli";
import {PackageUtils} from "../utils/package.utils";
import {IFormFieldInfo, IFormsFunctionsService} from "../interfaces/ngx-boilerplate-functions.interface";

@Injectable({
  providedIn: 'root'
})
export class FormsFunctionsService implements IFormsFunctionsService{
  private majorVersion = parseInt(VERSION.major, 10);

  setFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: IFormFieldInfo[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if ( field?.name &&  form?.contains(field.name) && field?.validations?.length) {
          form.get(field.name)!.setValidators(field.validations);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }
  removeFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: IFormFieldInfo[]): void {
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
  addAndRemoveFieldsOnSubmission(form: FormGroup | UntypedFormGroup, fieldsToAdd: IFormFieldInfo[] = [], fieldsToRemove: string[] = [] ): any {
    let payload = form?.value;
    if(payload) {
      if(fieldsToAdd?.length) {
        for(const itemToAdd of fieldsToAdd) {
          payload = itemToAdd ? {...payload, [itemToAdd?.name]: itemToAdd?.value } : payload;
        }
      }
      if(fieldsToRemove?.length) {
        for(const itemToRemove of fieldsToRemove) {
          if(payload?.hasOwnProperty(itemToRemove)) {
            delete payload[itemToRemove];
          }
        }
      }
    }
    return payload;
  }
  disableFields(form: FormGroup | UntypedFormGroup, fieldsToDisable: IFormFieldInfo[]): void {
    if(fieldsToDisable?.length) {
      for(const field of fieldsToDisable) {
        if(field?.name && form?.contains(field.name) ) {
          if(field?.options) {
            form.controls[field?.name].disable(field.options)
          } else {
            form.controls[field?.name].disable();
          }
        }
      }
    }
  }
  patchValuesToFields(form: FormGroup | UntypedFormGroup, fieldsToSet: IFormFieldInfo[]): void {
    if (form && fieldsToSet?.length) {
      for (const field of fieldsToSet) {
        if (field?.name && form?.contains(field.name)) {
          form.get(field.name)?.patchValue(field?.value ?? null)
        }
      }
    }
  }

  changeFormControlFields(form: FormGroup | UntypedFormGroup, fieldsToAdd: IFormFieldInfo[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void {
    if (fieldsToAdd?.length) {
      for (const field of fieldsToAdd) {
        if (field?.name && !form?.contains(field.name)) {
          if (PackageUtils.isUntypedFormGroup(form)) {
            form.addControl(field.name, new UntypedFormControl(field?.value ?? null, field?.validations?.length ?
              field.validations : []));
          }
          if (PackageUtils.isFormGroup(form)) {
            form.addControl(field.name, new FormControl(field?.value ?? null, field?.validations?.length ?
              field.validations : []));
          }
        }
      }
      if (fieldsToRemove?.length) {
        for (const field of fieldsToRemove) {
          if (field?.name && form?.contains(field.name)) {
            form.removeControl(field.name, {emitEvent: !!field?.emitEvent})
          }
        }
      }
    }
  }

checkIfFormControlsMatch( formGroup: FormGroup | UntypedFormGroup, controlName: string, matchingControlName: string): void {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }

  initializeFormGroup(formBuilder: FormBuilder | UntypedFormBuilder, fields: IFormFieldInfo[]): FormGroup | UntypedFormGroup | undefined {
        const formGroup = PackageUtils.isFormBuilder(formBuilder) ? new FormGroup({}) : new UntypedFormGroup({});
        if(!fields?.length) {
          return formGroup;
        }
        for (const field of fields) {
           if(PackageUtils.isFormBuilder(formBuilder)) {
             formGroup.addControl(field.name, new FormControl(field?.value ?? field?.defaultValue ?? null));
           }
           if(PackageUtils.isUntypedFormBuilder(formBuilder)) {
             formGroup.addControl(field.name, new UntypedFormControl(field?.value ?? field?.defaultValue ?? null));
           }
        }
        return formGroup;
  }
  resetFormGroup(formGroup: FormGroup | UntypedFormGroup, defaultFields?: IFormFieldInfo[]): void {
       if(!defaultFields?.length) {
          formGroup.reset();
          return;
       }
       let defaultValuesToReset: any = {};
       for (const field of defaultFields) {
         if(!defaultValuesToReset.hasOwnProperty(field.name)) {
           defaultValuesToReset = {...defaultValuesToReset, [field.name]: field?.value ?? null};
         }
       }
       formGroup.reset(defaultValuesToReset);
  }
  getFormControlErrorMessage(control: FormControl | UntypedFormControl,
                      errorType:  'required' | 'requiredTrue' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email'): any {
      if(!control) {
        return undefined;
      }
      if(control?.hasError(errorType)) {
        return control.getError(errorType);
      }
  }
  isFormControlValidWithControlMark(control: FormControl, controlMarks: ('dirty' | 'pristine' | 'touched')[]): boolean | undefined {
       if(!control || !controlMarks?.length) {
         return false;
       }
       controlMarks = [...new Set(controlMarks)];
       return control?.invalid && controlMarks.every(mark => controlMarks.find(cMark => cMark === mark));
  }
  isFormGroupValid(forGroup: FormGroup | UntypedFormGroup): boolean {
     return <boolean>forGroup?.valid;
  }
  getFormGroupErrorMessages(forGroup: FormGroup | UntypedFormGroup): {key: string[]} | undefined {
    let errors: {key: string[]} | undefined = undefined;
    Object.keys(forGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors | null | undefined = forGroup.get(key)?.errors;
      if (controlErrors) {
        if(errors) {
          errors = {...errors, [key]: controlErrors};
        }
      }
    });
    return errors;
  }
  getFormPayloadForSubmission(formGroup: FormGroup | UntypedFormGroup, fieldsToFormat: IFormFieldInfo[]): any {
      if(!fieldsToFormat?.length) {
        return formGroup?.value;
      }
      let valueObj: any = formGroup?.value;
      if(!valueObj) {
        return undefined;
      }
      for (const field of fieldsToFormat) {
        if(field?.formatType === 'remove') {
          valueObj = PackageUtils.removeKeyFromObject(valueObj, field.name)
        }
        if(field?.formatType === 'string') {
          valueObj = PackageUtils.convertToString(valueObj, field.name)
        }
        if(field?.formatType === 'date') {
           valueObj = PackageUtils.formatDate(valueObj, field.name, field?.dateFormat)
        }
        if(field?.formatType === 'number') {
            valueObj = PackageUtils.convertToNumber(valueObj, field.name);
        }
        if(field?.formatType === 'float') {
          valueObj = PackageUtils.convertToFloat(valueObj, field.name);
        }
        if(field?.formatType === 'boolean') {
          valueObj = PackageUtils.convertToBoolean(valueObj, field.name);
        }
        if(field?.formatType === 'add') {
          valueObj = PackageUtils.addFieldToObject(valueObj, field.name, field?.value);
        }
      }
      return valueObj;
  }
  patchFormGroupValues(formGroup: FormGroup | UntypedFormGroup, data: any, mappedKeys?: IFormFieldInfo[]): FormGroup | UntypedFormGroup {
     if(!formGroup) {
       return formGroup;
     }
     if(!mappedKeys?.length) {
       formGroup.patchValue(data);
     } else {
       formGroup.patchValue({
         ...data, ...(mappedKeys.reduce((obj, currentValue) => ({
           ...obj,
           [currentValue?.name]: currentValue?.mappedKey && data?.hasOwnProperty(currentValue?.mappedKey) ? data[currentValue.mappedKey] : undefined
         }), {}))
       });
     }
     return formGroup;
  }
  markAllControlsAsTouched(form: FormGroup | UntypedFormGroup): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  addFormControl(form: FormGroup | UntypedFormGroup, controlName: string,
                 control: FormControl | UntypedFormGroup): void {
    if(!control || !controlName || !form) {
      return;
    }
    if((PackageUtils.isFormGroup(form) && PackageUtils.isUntypedFormControl(control)) ||
      (PackageUtils.isUntypedFormGroup(form) && PackageUtils.isFormControl(control))) {
      return;
    }
    form.addControl(controlName, control);
  }

  removeFormControl(form: FormGroup, controlName: string): void {
    if(!form.contains(controlName)) {
      return;
    }
    form.removeControl(controlName);
  }



}
