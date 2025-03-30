import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn
} from "@angular/forms";

export interface IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
  formatType?:  'string' | 'number' | 'float' | 'boolean' | 'date' |  'remove' | 'add';
  dateFormat?: string;
  mappedKey?: string;
}
export type InitializeFormGroupInput =  {
  name: string;
  value?: any;
  validations?: ValidatorFn[];
}
export type FormGroupValidationInput = {
  name: string;
  validations?: ValidatorFn[];
}
export type RemoveFormGroupValidationInput = {
  name: string;
  defaultValue?: any;
}
export type CommonFieldInput = {
  name: string;
  value?: any;
}
export type DisableFieldInput = {
  name: string;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
}
export type FormatFieldInput = {
  name: string;
  formatType?:  'string' | 'number' | 'float' | 'boolean' | 'date' |  'remove' | 'add';
  dateFormat?: string;
  value?: any;
}
export type MappedKeysInput = {
  name: string;
  mappedKey?: string;
}
export interface IFormsFunctionsService {
  setFormGroupValidations(form: FormGroup | any, fields: FormGroupValidationInput[]): void;
  removeFormGroupValidations(form: FormGroup | any, fields: RemoveFormGroupValidationInput[]): void;
  addAndRemoveFieldsOnSubmission(form: FormGroup | any, fieldsToAdd: CommonFieldInput[],
                                 fieldsToRemove: string[]): any;
  disableFields(form: FormGroup | any, fieldsToDisable: DisableFieldInput[]): void;
  patchValuesToFields(form: FormGroup | any, fieldsToSet: CommonFieldInput[]): void;
  changeFormControlFields(form: FormGroup | any, fieldsToAdd: InitializeFormGroupInput[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void;
  checkIfFormControlsMatch( formGroup: FormGroup | any, controlName: string,
                            matchingControlName: string): void;
  initializeFormGroup(formBuilder: FormBuilder | any, fields: InitializeFormGroupInput[]): FormGroup | undefined;
  resetFormGroup(formGroup: FormGroup | any, defaultFields?: IFormFieldInfo[]): void;
  getFormControlErrorMessage(control: FormControl | any,
                             errorType:  'required' | 'requiredTrue' | 'minLength' | 'maxLength'
                               | 'pattern' | 'min' | 'max' | 'email'): any;
  isFormControlValidWithControlMark(control: FormControl, controlMarks: ('dirty' | 'pristine' | 'touched')[]): boolean | undefined;
  isFormGroupValid(forGroup: FormGroup | any): boolean;
  getFormGroupErrorMessages(forGroup: FormGroup | any): {key: string[]} | {} | undefined;
  formatPayloadForSubmission(formGroup: FormGroup | any, fieldsToFormat: FormatFieldInput[]): any;
  patchFormGroupValues(formGroup: FormGroup | any, data: any,
                       mappedKeys?: MappedKeysInput[]): FormGroup | any;
  markAllControlsAsTouched(form: FormGroup | any): void;
  addFormControl(form: FormGroup | any, controlName: string,
                 control: FormControl | any): void;
  removeFormControl(form: FormGroup, controlName: string): void;
}
