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
import {FormFieldInfo} from "../interfaces/ngx-boilerplate-functions.interface";

@Injectable({
  providedIn: 'root'
})
export class FormsFunctionsService {
  private majorVersion = parseInt(VERSION.major, 10);

  setFormFieldsValidations(form: FormGroup | UntypedFormGroup, fields: FormFieldInfo[]): void {
    if (form && fields?.length) {
      for (const field of fields) {
        if ( field?.name &&  form?.contains(field.name) && field?.validations?.length) {
          form.get(field.name)!.setValidators(field.validations);
          form.get(field.name)!.updateValueAndValidity();
        }
      }
    }
  }
  removeFormFieldsValidations(form: FormGroup | UntypedFormGroup, fields: FormFieldInfo[]): void {
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
  addAndRemoveFieldsOnSubmission(form: FormGroup | UntypedFormGroup, fieldsToAdd: FormFieldInfo[] = [], fieldsToRemove: string[] = [] ): any {
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
  disableFields(form: FormGroup | UntypedFormGroup, fieldsToDisable: FormFieldInfo[]): void {
    if(fieldsToDisable?.length) {
      for(const field of fieldsToDisable) {
        if(field?.name && form?.contains(field.name) ) {
          if(field?.options) {
            form.controls[field].disable(field.options)
          } else {
            form.controls[field].disable();
          }
        }
      }
    }
  }
  patchValuesToFields(form: FormGroup | UntypedFormGroup, fieldsToSet: FormFieldInfo[]): void {
    if (form && fieldsToSet?.length) {
      for (const field of fieldsToSet) {
        if (field?.name && form?.contains(field.name)) {
          form.get(field.name)?.patchValue(field?.value ?? null)
        }
      }
    }
  }

  changeFormControlFields(form: FormGroup | UntypedFormGroup, fieldsToAdd: FormFieldInfo[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void {
    if (fieldsToAdd?.length) {
      for (const field of fieldsToAdd) {
        if (field?.name && !form?.contains(field.name)) {
          if (PackageUtils.isUntypedFormGroup(form)) {
            form.addControl(field.name, new UntypedFormControl(field?.value ?? null, field?.validations?.length ? field.validations : []));
          }
          if (PackageUtils.isFormGroup(form)) {
            form.addControl(field.name, new FormControl(field?.value ?? null, field?.validations?.length ? field.validations : []));
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

    checkIfTextsMatch( formGroup: FormGroup | UntypedFormGroup, controlName: string, matchingControlName: string): void {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      }

      initializeFormGroup(formBuilder: FormBuilder | UntypedFormBuilder, fields: FormFieldInfo[]): FormGroup | undefined {
            const formGroup = formBuilder.group({});
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
      resetFormGroup(formGroup: FormGroup | UntypedFormGroup, defaultFields?: FormFieldInfo[]): void {
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
      isFormControlValidWithControlMark(control: FormControl, controlMarks: ('dirty' | 'pristine' | 'touched')[]): boolean {
           if(!control || !controlMarks?.length) {
             return false;
           }
           controlMarks = [...new Set(controlMarks)];
           control?.invalid && controlMarks.every(mark => controlMarks[mark]);
      }
      isFormGroupValid(forGroup: FormGroup | UntypedFormGroup): boolean {
         return <boolean>forGroup?.valid;
      }
      getFormGroupErrorMessages(forGroup: FormGroup | UntypedFormGroup): {key: string[]} | undefined {
        const errors: {key: string[]} | undefined = undefined;
        Object.keys(forGroup.controls).forEach(key => {
          const controlErrors: ValidationErrors | null | undefined = forGroup.get(key)?.errors;
          if (controlErrors) {
            errors[key] = controlErrors;
          }
        });
        return errors;
      }
      getFormPayloadForSubmission(formGroup: FormGroup | UntypedFormGroup, fieldsToFormat: FormFieldInfo[]) {
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
          }
          return valueObj;
      }
      patchFormGroupValues(formGroup: FormGroup | UntypedFormGroup, data: any, mappedKeys?: FormFieldInfo[]): FormGroup | UntypedFormGroup {
         if(!formGroup) {
           return formGroup;
         }
         if(!mappedKeys?.length) {
           formGroup.patchValue(data);
         } else {
           formGroup.patchValue({
             ...data, ...(mappedKeys.reduce((obj, currentValue) => ({
               ...obj,
               [currentValue?.name]: data?.hasOwnProperty(currentValue?.mappedKey) ? data[currentValue?.mappedKey] : undefined
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



}
