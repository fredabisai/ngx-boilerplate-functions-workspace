import {Injectable} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
   ValidationErrors
} from "@angular/forms";
import {VERSION} from "@angular/cli";
import {PackageUtils} from "../utils/package.utils";
import {
  DisableFieldInput,
  CommonFieldInput,
  FormGroupValidationInput,
  IFormsFunctionsService,
  InitializeFormGroupInput, RemoveFormGroupValidationInput, FormatFieldInput,
  MappedKeysInput
} from "../interfaces/ngx-boilerplate-functions.interface";

@Injectable({
  providedIn: 'root'
})
export class FormsFunctionsService implements IFormsFunctionsService{
  private majorVersion = parseInt(VERSION.major, 10);

  setFormGroupValidations(form: FormGroup |  any, fields: FormGroupValidationInput[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if ( field?.name &&  form?.contains(field.name) && field?.validations?.length) {
          form.get(field.name)!.setValidators(field.validations);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }
  removeFormGroupValidations(form: FormGroup | any, fields: RemoveFormGroupValidationInput[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if (field?.name &&  form?.contains(field.name)) {
          form.get(field.name)!.setErrors(null);
          form.get(field.name)!.clearValidators();
          form.get(field.name)!.patchValue(field?.defaultValue);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }
  addAndRemoveFieldsOnSubmission(form: FormGroup | any, fieldsToAdd: CommonFieldInput[] = [], fieldsToRemove: string[] = [] ): any {
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
  disableFields(form: FormGroup | any , fieldsToDisable: DisableFieldInput[]): void {
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
  patchValuesToFields(form: FormGroup | any, fieldsToSet: CommonFieldInput[]): void {
    if (form && fieldsToSet?.length) {
      for (const field of fieldsToSet) {
        if (field?.name && form?.contains(field.name)) {
          form.get(field.name)?.patchValue(field?.value ?? null)
        }
      }
    }
  }

  changeFormControlFields(form: FormGroup | any, fieldsToAdd: InitializeFormGroupInput[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void {
    if (fieldsToAdd?.length) {
      for (const field of fieldsToAdd) {
        if (field?.name && !form?.contains(field.name)) {
          // if (PackageUtils.isUntypedFormGroup(form)) {
          //   form.addControl(field.name, new UntypedFormControl(field?.value ?? null, field?.validations?.length ?
          //     field.validations : []));
          // }
          // if (PackageUtils.isFormGroup(form)) {
            form.addControl(field.name, new FormControl(field?.value ?? null, field?.validations?.length ?
              field.validations : []));
          // }
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

checkIfFormControlsMatch( formGroup: FormGroup | any, controlName: string, matchingControlName: string): void {
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

  initializeFormGroup(formBuilder: FormBuilder | any, fields: InitializeFormGroupInput[]): FormGroup | any | undefined {
        // const formGroup = PackageUtils.isFormBuilder(formBuilder) ? new FormGroup({}) : new UntypedFormGroup({});
    const formGroup =  new FormGroup({} as any);
        if(!fields?.length) {
          return formGroup;
        }
        for (const field of fields) {
           // if(PackageUtils.isFormBuilder(formBuilder)) {
             formGroup.addControl(field.name, new FormControl(field?.value ??  undefined, field?.validations ?? []));
           // }
           // if(PackageUtils.isUntypedFormBuilder(formBuilder)) {
           //   formGroup.addControl(field.name, new UntypedFormControl(field?.value ??  undefined, field?.validations ?? []));
           // }
        }
        return formGroup;
  }
  resetFormGroup(formGroup: FormGroup  | any, defaultFields?: CommonFieldInput[]): void {
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
  getFormControlErrorMessage(control: FormControl   | any,
                      errorType:  'required' | 'requiredTrue' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email'): any {
      if(!control) {
        return undefined;
      }
      if(control?.hasError(errorType)) {
        return control.getError(errorType);
      }
  }
  isFormControlValidWithControlMark(control: FormControl | any  , controlMarks: ('dirty' | 'pristine' | 'touched' | 'invalid')[]): boolean | undefined {
       if(!control || !controlMarks?.length) {
         return false;
       }
       controlMarks = [...new Set(controlMarks)];
       return controlMarks.every(mark => controlMarks.find(cMark => cMark === mark));
  }
  isFormGroupValid(forGroup: FormGroup | any): boolean {
     return <boolean>forGroup?.valid;
  }
  getFormGroupErrorMessages(forGroup: FormGroup | any): {key: string[]} | {} | undefined {
    let errors: {key: string[]}  | {  } = {};
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
  formatPayloadForSubmission(formGroup: FormGroup | any, fieldsToFormat: FormatFieldInput[]): any {
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
  patchFormGroupValues(formGroup: FormGroup  | any, data: any, mappedKeys?: MappedKeysInput[]): FormGroup | any {
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
  markAllControlsAsTouched(form: FormGroup  | any): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  addFormControl(form: FormGroup | any, controlName: string,
                 control: FormControl | any): void {
    if(!control || !controlName || !form) {
      return;
    }
    form.addControl(controlName, control);
  }

  removeFormControl(form: FormGroup | any, controlName: string): void {
    if(!form.contains(controlName)) {
      return;
    }
    form.removeControl(controlName);
  }



}
