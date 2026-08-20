import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export type FormControlMark =
  | 'dirty' | 'pristine' | 'touched' | 'untouched'
  | 'valid' | 'invalid' | 'pending' | 'disabled' | 'enabled';

export type BuiltInValidationError =
  | 'required' | 'requiredTrue' | 'minlength' | 'maxlength'
  | 'pattern' | 'min' | 'max' | 'email';

export type FormFieldName<TForm extends FormGroup> =
  Extract<keyof TForm['controls'], string>;

export type FormRawValue<TForm extends FormGroup> =
  ReturnType<TForm['getRawValue']>;

export type ControlValue<TControl> =
  TControl extends AbstractControl<infer TValue> ? TValue : never;

export type FormGroupValidationInput<TName extends string = string> = {
  name: TName;
  validations: readonly ValidatorFn[];
};

export type RemoveFormGroupValidationInput<TName extends string = string> = {
  name: TName;
  defaultValue?: unknown;
  preserveErrors?: readonly string[];
};

export type CommonFieldInput<TValue = unknown, TName extends string = string> = {
  name: TName;
  value?: TValue;
};

export type TypedCommonFieldInput<TForm extends FormGroup> = {
  [TName in FormFieldName<TForm>]: CommonFieldInput<
    ControlValue<TForm['controls'][TName]>,
    TName
  >;
}[FormFieldName<TForm>];

export type TypedRemoveValidationInput<TForm extends FormGroup> = {
  [TName in FormFieldName<TForm>]: RemoveFormGroupValidationInput<TName> & {
    defaultValue?: ControlValue<TForm['controls'][TName]>;
  };
}[FormFieldName<TForm>];

export type DisableFieldInput<TName extends string = string> = {
  name: TName;
  options?: {onlySelf?: boolean; emitEvent?: boolean};
};

export type InitializeFormGroupInput<TValue = unknown> = {
  name: string;
  value?: TValue;
  validations?: readonly ValidatorFn[];
};

export type RemoveControlInput = {
  name: string;
  emitEvent?: boolean;
};

export type FormatFieldInput =
  | {name: string; formatType: 'remove'}
  | {name: string; formatType: 'string'}
  | {name: string; formatType: 'number' | 'float' | 'boolean'}
  | {name: string; formatType: 'date'; dateFormat: string; locale?: string}
  | {name: string; formatType: 'add'; value: unknown};

export type MappedKeysInput<TName extends string = string> = {
  name: TName;
  mappedKey: string;
};

export type FormGroupErrorMessages = Record<string, ValidationErrors>;

/** Backwards-compatible aggregate type. Prefer the focused input types above. */
export interface IFormFieldInfo {
  name: string;
  validations?: readonly ValidatorFn[];
  defaultValue?: unknown;
  value?: unknown;
  options?: {onlySelf?: boolean; emitEvent?: boolean};
  formatType?: FormatFieldInput['formatType'];
  dateFormat?: string;
  mappedKey?: string;
}

/** Public service contract, useful for abstraction and test doubles. */
export interface IFormsFunctionsService {
  setFormGroupValidations<TForm extends FormGroup>(
    form: TForm,
    fields: readonly FormGroupValidationInput<FormFieldName<TForm>>[],
  ): void;
  removeFormGroupValidations<TForm extends FormGroup>(
    form: TForm,
    fields: readonly TypedRemoveValidationInput<TForm>[],
  ): void;
  getFormControlError(control: AbstractControl, errorType: string): unknown | undefined;
  hasControlMarks(control: AbstractControl, controlMarks: readonly FormControlMark[]): boolean;
  getFormControlErrorMessage(
    control: AbstractControl,
    errorType: BuiltInValidationError,
  ): unknown | undefined;
  isFormControlValidWithControlMark(
    control: AbstractControl,
    controlMarks: readonly FormControlMark[],
  ): boolean;
  checkIfFormControlsMatch<TForm extends FormGroup>(
    form: TForm,
    controlName: FormFieldName<TForm>,
    matchingControlName: FormFieldName<TForm>,
  ): void;
  addAndRemoveFieldsOnSubmission<TForm extends FormGroup>(
    form: TForm,
    fieldsToAdd?: readonly CommonFieldInput[],
    fieldsToRemove?: readonly string[],
  ): Record<string, unknown>;
  disableFields<TForm extends FormGroup>(
    form: TForm,
    fields: readonly DisableFieldInput<FormFieldName<TForm>>[],
  ): void;
  patchValuesToFields<TForm extends FormGroup>(
    form: TForm,
    fields: readonly TypedCommonFieldInput<TForm>[],
  ): void;
  changeFormControlFields(
    form: UntypedFormGroup,
    fieldsToAdd: readonly InitializeFormGroupInput[],
    fieldsToRemove: readonly RemoveControlInput[],
  ): void;
  initializeFormGroup(fields?: readonly InitializeFormGroupInput[]): UntypedFormGroup;
  resetFormGroup<TForm extends FormGroup>(
    form: TForm,
    defaultFields?: readonly TypedCommonFieldInput<TForm>[],
  ): void;
  isFormGroupValid(form: FormGroup): boolean;
  getFormGroupErrorMessages(form: FormGroup): FormGroupErrorMessages;
  formatPayloadForSubmission(
    form: FormGroup,
    fieldsToFormat?: readonly FormatFieldInput[],
  ): Record<string, unknown>;
  patchFormGroupValues<TForm extends FormGroup>(
    form: TForm,
    data: Partial<FormRawValue<TForm>> & Record<string, unknown>,
    mappedKeys?: readonly MappedKeysInput<FormFieldName<TForm>>[],
  ): TForm;
  markAllControlsAsTouched(form: FormGroup): void;
  addFormControl(
    form: UntypedFormGroup,
    controlName: string,
    control: FormControl<unknown>,
  ): void;
  removeFormControl(form: UntypedFormGroup, controlName: string): void;
}
