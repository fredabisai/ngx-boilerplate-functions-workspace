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
  setFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: FormGroupValidationInput[]): void;
  removeFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: RemoveFormGroupValidationInput[]): void;
  addAndRemoveFieldsOnSubmission(form: FormGroup | UntypedFormGroup, fieldsToAdd: CommonFieldInput[],
                                 fieldsToRemove: string[]): any;
  disableFields(form: FormGroup | UntypedFormGroup, fieldsToDisable: DisableFieldInput[]): void;
  patchValuesToFields(form: FormGroup | UntypedFormGroup, fieldsToSet: CommonFieldInput[]): void;
  changeFormControlFields(form: FormGroup | UntypedFormGroup, fieldsToAdd: InitializeFormGroupInput[],
                          fieldsToRemove: {name: string, emitEvent?: boolean}[]): void;
  checkIfFormControlsMatch( formGroup: FormGroup | UntypedFormGroup, controlName: string,
                            matchingControlName: string): void;
  initializeFormGroup(formBuilder: FormBuilder | UntypedFormBuilder, fields: InitializeFormGroupInput[]): FormGroup | undefined;
  resetFormGroup(formGroup: FormGroup | UntypedFormGroup, defaultFields?: IFormFieldInfo[]): void;
  getFormControlErrorMessage(control: FormControl | UntypedFormControl,
                             errorType:  'required' | 'requiredTrue' | 'minLength' | 'maxLength'
                               | 'pattern' | 'min' | 'max' | 'email'): any;
  isFormControlValidWithControlMark(control: FormControl, controlMarks: ('dirty' | 'pristine' | 'touched')[]): boolean | undefined;
  isFormGroupValid(forGroup: FormGroup | UntypedFormGroup): boolean;
  getFormGroupErrorMessages(forGroup: FormGroup | UntypedFormGroup): {key: string[]} | {} | undefined;
  formatPayloadForSubmission(formGroup: FormGroup | UntypedFormGroup, fieldsToFormat: FormatFieldInput[]): any;
  patchFormGroupValues(formGroup: FormGroup | UntypedFormGroup, data: any,
                       mappedKeys?: MappedKeysInput[]): FormGroup | UntypedFormGroup;
  markAllControlsAsTouched(form: FormGroup | UntypedFormGroup): void;
  addFormControl(form: FormGroup | UntypedFormGroup, controlName: string,
                 control: FormControl | UntypedFormGroup): void;
  removeFormControl(form: FormGroup, controlName: string): void;
}
