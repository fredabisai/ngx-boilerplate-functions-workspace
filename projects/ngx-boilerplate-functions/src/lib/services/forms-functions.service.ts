import {Injectable} from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup,
} from '@angular/forms';
import {
  BuiltInValidationError, CommonFieldInput, DisableFieldInput, FormatFieldInput,
  FormControlMark, FormFieldName, FormGroupErrorMessages, FormGroupValidationInput,
  FormRawValue, IFormsFunctionsService, InitializeFormGroupInput, MappedKeysInput,
  RemoveControlInput, TypedCommonFieldInput, TypedRemoveValidationInput,
} from '../interfaces/ngx-boilerplate-functions.interface';
import {PackageUtils, Payload} from '../utils/package.utils';

@Injectable({providedIn: 'root'})
export class FormsFunctionsService implements IFormsFunctionsService {
  setFormGroupValidations<TForm extends FormGroup>(
    form: TForm,
    fields: readonly FormGroupValidationInput<FormFieldName<TForm>>[],
  ): void {
    for (const field of fields) {
      const control = form.get(field.name);
      if (!control) continue;
      control.setValidators([...field.validations]);
      control.updateValueAndValidity();
    }
  }

  removeFormGroupValidations<TForm extends FormGroup>(
    form: TForm,
    fields: readonly TypedRemoveValidationInput<TForm>[],
  ): void {
    for (const field of fields) {
      const control = form.get(field.name);
      if (!control) continue;
      const preservedErrors = Object.fromEntries(
        (field.preserveErrors ?? [])
          .filter(errorName => control.hasError(errorName))
          .map(errorName => [errorName, control.getError(errorName)]),
      );
      control.clearValidators();
      if ('defaultValue' in field) {
        (control as AbstractControl<unknown>).patchValue(field.defaultValue);
      }
      control.updateValueAndValidity();
      if (Object.keys(preservedErrors).length) {
        control.setErrors({...control.errors, ...preservedErrors});
      }
    }
  }

  addAndRemoveFieldsOnSubmission<TForm extends FormGroup>(
    form: TForm,
    fieldsToAdd: readonly CommonFieldInput[] = [],
    fieldsToRemove: readonly string[] = [],
  ): Payload {
    let payload: Payload = {...this.toPayload(form.value)};
    for (const field of fieldsToAdd ?? []) {
      payload = PackageUtils.addFieldToObject(payload, field.name, field.value);
    }
    for (const fieldName of fieldsToRemove ?? []) {
      payload = PackageUtils.removeKeyFromObject(payload, fieldName);
    }
    return payload;
  }

  disableFields<TForm extends FormGroup>(
    form: TForm,
    fields: readonly DisableFieldInput<FormFieldName<TForm>>[],
  ): void {
    for (const field of fields) form.get(field.name)?.disable(field.options);
  }

  patchValuesToFields<TForm extends FormGroup>(
    form: TForm,
    fields: readonly TypedCommonFieldInput<TForm>[],
  ): void {
    for (const field of fields) {
      (form.get(field.name) as AbstractControl<unknown> | null)?.patchValue(field.value ?? null);
    }
  }

  /** Runtime-defined heterogeneous controls are intentionally untyped. */
  changeFormControlFields(
    form: UntypedFormGroup,
    fieldsToAdd: readonly InitializeFormGroupInput[],
    fieldsToRemove: readonly RemoveControlInput[],
  ): void {
    for (const field of fieldsToAdd) {
      if (!form.contains(field.name)) {
        form.addControl(field.name, new UntypedFormControl(
          field.value ?? null,
          [...(field.validations ?? [])],
        ));
      }
    }
    for (const field of fieldsToRemove) {
      if (form.contains(field.name)) {
        form.removeControl(field.name, {emitEvent: field.emitEvent ?? true});
      }
    }
  }

  /** Performs an immediate comparison while preserving unrelated control errors. */
  checkIfFormControlsMatch<TForm extends FormGroup>(
    form: TForm,
    controlName: FormFieldName<TForm>,
    matchingControlName: FormFieldName<TForm>,
  ): void {
    const control = form.get(controlName);
    const matchingControl = form.get(matchingControlName);
    if (!control || !matchingControl) return;
    const errors = matchingControl.errors ?? {};
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({...errors, mustMatch: true});
      return;
    }
    const {mustMatch: _mustMatch, ...remainingErrors} = errors;
    matchingControl.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  /** Creates an explicitly untyped group from runtime field metadata. */
  initializeFormGroup(fields: readonly InitializeFormGroupInput[] = []): UntypedFormGroup {
    const controls: Record<string, UntypedFormControl> = {};
    for (const field of fields) {
      controls[field.name] = new UntypedFormControl(
        field.value ?? null,
        [...(field.validations ?? [])],
      );
    }
    return new UntypedFormGroup(controls);
  }

  resetFormGroup<TForm extends FormGroup>(
    form: TForm,
    defaultFields: readonly TypedCommonFieldInput<TForm>[] = [],
  ): void {
    form.reset();
    for (const field of defaultFields) {
      (form.get(field.name) as AbstractControl<unknown> | null)?.reset(field.value ?? null);
    }
  }

  getFormControlError(control: AbstractControl, errorType: string): unknown | undefined {
    return control.hasError(errorType) ? control.getError(errorType) : undefined;
  }

  /** Returns the raw error value for a built-in Angular validation error. */
  getFormControlErrorMessage(
    control: AbstractControl,
    errorType: BuiltInValidationError,
  ): unknown | undefined {
    return this.getFormControlError(control, errorType);
  }

  hasControlMarks(control: AbstractControl, marks: readonly FormControlMark[]): boolean {
    return marks.length > 0 && marks.every(mark => control[mark]);
  }

  /** Checks whether all requested state marks are currently true. */
  isFormControlValidWithControlMark(
    control: AbstractControl,
    controlMarks: readonly FormControlMark[],
  ): boolean {
    return this.hasControlMarks(control, controlMarks);
  }

  isFormGroupValid(form: FormGroup): boolean {
    return form.valid;
  }

  getFormGroupErrorMessages(form: FormGroup): FormGroupErrorMessages {
    const errors: FormGroupErrorMessages = {};
    for (const [name, control] of Object.entries(form.controls)) {
      if (control.errors) errors[name] = control.errors;
    }
    return errors;
  }

  formatPayloadForSubmission(
    form: FormGroup,
    fieldsToFormat: readonly FormatFieldInput[] = [],
  ): Payload {
    let payload: Payload = {...this.toPayload(form.value)};
    for (const field of fieldsToFormat) {
      switch (field.formatType) {
        case 'remove': payload = PackageUtils.removeKeyFromObject(payload, field.name); break;
        case 'string': payload = PackageUtils.convertToString(payload, field.name); break;
        case 'date':
          payload = PackageUtils.formatDate(payload, field.name, field.dateFormat, field.locale);
          break;
        case 'number': payload = PackageUtils.convertToNumber(payload, field.name); break;
        case 'float': payload = PackageUtils.convertToFloat(payload, field.name); break;
        case 'boolean': payload = PackageUtils.convertToBoolean(payload, field.name); break;
        case 'add': payload = PackageUtils.addFieldToObject(payload, field.name, field.value); break;
      }
    }
    return payload;
  }

  patchFormGroupValues<TForm extends FormGroup>(
    form: TForm,
    data: Partial<FormRawValue<TForm>> & Record<string, unknown>,
    mappedKeys: readonly MappedKeysInput<FormFieldName<TForm>>[] = [],
  ): TForm {
    const patch: Payload = {...this.toPayload(data)};
    for (const mapping of mappedKeys) {
      patch[mapping.name] = PackageUtils.hasOwn(data, mapping.mappedKey)
        ? (data as Record<string, unknown>)[mapping.mappedKey]
        : undefined;
    }
    form.patchValue(patch);
    return form;
  }

  markAllControlsAsTouched(form: FormGroup): void {
    form.markAllAsTouched();
  }

  /** Runtime-defined heterogeneous controls are intentionally untyped. */
  addFormControl(form: UntypedFormGroup, controlName: string, control: FormControl<unknown>): void {
    if (controlName && control) form.addControl(controlName, control);
  }

  /** Runtime-defined heterogeneous controls are intentionally untyped. */
  removeFormControl(form: UntypedFormGroup, controlName: string): void {
    if (form.contains(controlName)) form.removeControl(controlName);
  }

  private toPayload(value: object): Payload {
    return value as Payload;
  }
}
