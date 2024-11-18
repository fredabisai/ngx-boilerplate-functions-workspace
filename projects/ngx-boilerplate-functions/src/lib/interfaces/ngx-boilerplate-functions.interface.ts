import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn
} from "@angular/forms";
import {FormsFunctionsService} from "../services/forms-functions.service";

export interface IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
  formatType?: 'string' | 'number' | 'float' | 'boolean' | 'date' | 'datetime';
  dateFormat?: string;
  mappedKey?: string;
}
export class FormFieldInfo implements IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
  formatType?: 'string' | 'number' | 'float' | 'boolean' | 'date' |  'remove' | 'add';
  dateFormat?: string;
  mappedKey?: string;
}
export interface IFormsFunctionsService {
  setFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: FormFieldInfo[]): void;
  removeFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: FormFieldInfo[]): void;
  addAndRemoveFieldsOnSubmission(form: FormGroup | UntypedFormGroup, fieldsToAdd: FormFieldInfo[] = [],
                                 fieldsToRemove: string[] = [] ): any;
  disableFields(form: FormGroup | UntypedFormGroup, fieldsToDisable: FormFieldInfo[]): void;
  patchValuesToFields(form: FormGroup | UntypedFormGroup, fieldsToSet: FormFieldInfo[]): void;
  changeFormControlFields(form: FormGroup | UntypedFormGroup, fieldsToAdd: FormFieldInfo[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void;
  checkIfFormControlsMatch( formGroup: FormGroup | UntypedFormGroup, controlName: string,
                            matchingControlName: string): void;
  initializeFormGroup(formBuilder: FormBuilder | UntypedFormBuilder, fields: FormFieldInfo[]): FormGroup | undefined;
  resetFormGroup(formGroup: FormGroup | UntypedFormGroup, defaultFields?: FormFieldInfo[]): void;
  getFormControlErrorMessage(control: FormControl | UntypedFormControl,
                             errorType:  'required' | 'requiredTrue' | 'minLength' | 'maxLength'
                               | 'pattern' | 'min' | 'max' | 'email'): any;
  isFormControlValidWithControlMark(control: FormControl, controlMarks: ('dirty' | 'pristine' | 'touched')[]): boolean;
  isFormGroupValid(forGroup: FormGroup | UntypedFormGroup): boolean;
  getFormGroupErrorMessages(forGroup: FormGroup | UntypedFormGroup): {key: string[]} | undefined;
  getFormPayloadForSubmission(formGroup: FormGroup | UntypedFormGroup, fieldsToFormat: FormFieldInfo[]);
  patchFormGroupValues(formGroup: FormGroup | UntypedFormGroup, data: any,
                       mappedKeys?: FormFieldInfo[]): FormGroup | UntypedFormGroup;
  markAllControlsAsTouched(form: FormGroup | UntypedFormGroup): void;
  addFormControl(form: FormGroup | UntypedFormGroup, controlName: string,
                 control: FormControl | UntypedFormGroup): void;
  removeFormControl(form: FormGroup, controlName: string): void;
}
