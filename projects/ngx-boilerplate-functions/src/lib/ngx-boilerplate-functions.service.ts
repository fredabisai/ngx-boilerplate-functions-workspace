import { Injectable } from '@angular/core';
import {FormsFunctionsService} from "./services/forms-functions.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup
} from "@angular/forms";
import {IFormFieldInfo, IFormsFunctionsService} from "./interfaces/ngx-boilerplate-functions.interface";

@Injectable({
  providedIn: 'root'
})
export class NgxBoilerplateFunctionsService implements IFormsFunctionsService {

  constructor(private formsFunctionsService: FormsFunctionsService) { }
  setFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: IFormFieldInfo[]): void {
    this.formsFunctionsService.setFormGroupValidations(form, fields);
  }

  addAndRemoveFieldsOnSubmission(form: FormGroup | UntypedFormGroup, fieldsToAdd: IFormFieldInfo[], fieldsToRemove: string[]): any {
    return this.formsFunctionsService.addAndRemoveFieldsOnSubmission(form, fieldsToAdd);
  }

  addFormControl(form: FormGroup | UntypedFormGroup, controlName: string, control: FormControl | UntypedFormControl): void {
    this.formsFunctionsService.addFormControl(form, controlName, control);
  }

  changeFormControlFields(form: FormGroup | UntypedFormGroup, fieldsToAdd: IFormFieldInfo[], fieldsToRemove: {
    name: string;
    emitEvent?: boolean
  }[]): void {
    this.formsFunctionsService.changeFormControlFields(form, fieldsToAdd, fieldsToRemove);
  }

  checkIfFormControlsMatch(formGroup: FormGroup | UntypedFormGroup, controlName: string, matchingControlName: string): void {
    this.formsFunctionsService.checkIfFormControlsMatch(formGroup, controlName, matchingControlName);
  }

  disableFields(form: FormGroup | UntypedFormGroup, fieldsToDisable: IFormFieldInfo[]): void {
    this.formsFunctionsService.disableFields(form, fieldsToDisable);
  }

  getFormControlErrorMessage(control: FormControl | UntypedFormControl, errorType: "required" | "requiredTrue" | "minLength" | "maxLength" | "pattern" | "min" | "max" | "email"): any {
    return this.formsFunctionsService.getFormControlErrorMessage(control, errorType);
  }

  getFormGroupErrorMessages(forGroup: FormGroup | UntypedFormGroup): { key: string[] } | undefined {
    return this.formsFunctionsService.getFormGroupErrorMessages(forGroup);
  }

  getFormPayloadForSubmission(formGroup: FormGroup | UntypedFormGroup, fieldsToFormat: IFormFieldInfo[]): any {
    return this.formsFunctionsService.getFormPayloadForSubmission(formGroup, fieldsToFormat);
  }

  initializeFormGroup(formBuilder: FormBuilder | UntypedFormBuilder, fields: IFormFieldInfo[]): FormGroup | undefined {
    return this.formsFunctionsService.initializeFormGroup(formBuilder, fields);
  }

  isFormControlValidWithControlMark(control: FormControl, controlMarks: ("dirty" | "pristine" | "touched")[]): boolean | undefined {
    return this.formsFunctionsService.isFormControlValidWithControlMark(control, controlMarks);
  }

  isFormGroupValid(forGroup: FormGroup | UntypedFormGroup): boolean {
    return this.formsFunctionsService.isFormGroupValid(forGroup);
  }

  markAllControlsAsTouched(form: FormGroup | UntypedFormGroup): void {
    this.formsFunctionsService.markAllControlsAsTouched(form);
  }

  patchFormGroupValues(formGroup: FormGroup | UntypedFormGroup, data: any, mappedKeys?: IFormFieldInfo[]): FormGroup | UntypedFormGroup {
    return this.formsFunctionsService.patchFormGroupValues(formGroup, data, mappedKeys);
  }

  patchValuesToFields(form: FormGroup | UntypedFormGroup, fieldsToSet: IFormFieldInfo[]): void {
    this.formsFunctionsService.patchFormGroupValues(form, fieldsToSet);
  }

  removeFormControl(form: FormGroup, controlName: string): void {
    this.formsFunctionsService.removeFormControl(form, controlName);
  }

  removeFormGroupValidations(form: FormGroup | UntypedFormGroup, fields: IFormFieldInfo[]): void {
    this.formsFunctionsService.removeFormGroupValidations(form, fields);
  }

  resetFormGroup(formGroup: FormGroup | UntypedFormGroup, defaultFields?: IFormFieldInfo[]): void {
    this.formsFunctionsService.resetFormGroup(formGroup, defaultFields);
  }

}
