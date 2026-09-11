# @ngx-boilerplate-functions/forms

Type-safe helpers for Angular reactive forms. The package supports Angular 19–22. Typed forms retain control-name and value-type checking; runtime-defined heterogeneous forms use Angular's explicit `UntypedFormGroup` API.

## Installation

```sh
npm install @ngx-boilerplate-functions/forms
```

## Setup

The service is provided in root and can be injected:

```ts
import {Component, inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormsFunctionsService} from '@ngx-boilerplate-functions/forms';

@Component({selector: 'app-account', template: ''})
export class AccountComponent {
  private readonly forms = inject(FormsFunctionsService);

  readonly form = new FormGroup({
    name: new FormControl('', {nonNullable: true}),
    email: new FormControl('', {nonNullable: true}),
    age: new FormControl(0, {nonNullable: true}),
  });
}
```

It can also be constructed directly in framework-independent tests:

```ts
const forms = new FormsFunctionsService();
```

## Typed and untyped forms

Most methods accept both typed `FormGroup` and `UntypedFormGroup`. A typed form checks field names and values at compile time:

```ts
forms.patchValuesToFields(form, [
  {name: 'name', value: 'Ada'},
  {name: 'age', value: 36},
]);

// TypeScript errors:
// {name: 'missing', value: 'x'}
// {name: 'age', value: 'thirty-six'}
```

Methods that create or remove arbitrary heterogeneous controls—`initializeFormGroup`, `changeFormControlFields`, `addFormControl`, and `removeFormControl`—use `UntypedFormGroup` intentionally. When dynamic keys all share one control type, prefer Angular's typed `FormRecord`.

## Complete service API

### `setFormGroupValidations`

Replaces synchronous validators on existing controls and immediately recalculates validity.

```ts
setFormGroupValidations(form, fields): void

forms.setFormGroupValidations(form, [
  {name: 'email', validations: [Validators.required, Validators.email]},
]);
```

Typed forms restrict `name` to actual control names. An empty validator list is allowed and clears the composed validator through Angular's `setValidators([])` behavior.

### `removeFormGroupValidations`

Clears synchronous validators, optionally resets a field value, and can preserve selected manual error keys across validity recalculation.

```ts
removeFormGroupValidations(form, fields): void

forms.removeFormGroupValidations(form, [
  {
    name: 'email',
    defaultValue: '',
    preserveErrors: ['server'],
  },
]);
```

`defaultValue` is checked against the typed control's value type. Async validators are not removed by this method.

### `addAndRemoveFieldsOnSubmission`

Creates a new payload from `form.value`, adds fields, and removes fields without changing the form.

```ts
const payload = forms.addAndRemoveFieldsOnSubmission(
  form,
  [{name: 'source', value: 'web'}],
  ['confirmation'],
);
```

Returns `Record<string, unknown>`. As with Angular's `form.value`, disabled controls are excluded. Use the form's `getRawValue()` yourself when disabled values must be included.

### `disableFields`

Disables existing controls. Angular's `onlySelf` and `emitEvent` options are supported.

```ts
forms.disableFields(form, [
  {name: 'email', options: {emitEvent: false}},
]);
```

### `patchValuesToFields`

Patches individual controls. Typed forms verify both the control name and its value type.

```ts
forms.patchValuesToFields(form, [
  {name: 'name', value: 'Grace'},
  {name: 'age', value: 37},
]);
```

An omitted, `undefined`, or `null` field value is patched as `null`. Prefer non-null values for non-nullable controls.

### `changeFormControlFields`

Adds and removes controls whose heterogeneous structure is known only at runtime. This method explicitly accepts `UntypedFormGroup`.

```ts
forms.changeFormControlFields(
  dynamicForm,
  [
    {name: 'nickname', value: '', validations: [Validators.required]},
    {name: 'active', value: true},
  ],
  [{name: 'oldField', emitEvent: false}],
);
```

Existing controls are not replaced. Missing controls requested for removal are ignored.

### `checkIfFormControlsMatch`

Immediately compares two controls. It adds `mustMatch: true` to the matching control when values differ and removes only `mustMatch` when they become equal. Other errors are preserved.

```ts
forms.checkIfFormControlsMatch(form, 'password', 'confirmation');
```

This method is useful when the application intentionally controls when comparison happens. For automatic validation, use `fieldsMatch()`.

### `initializeFormGroup`

Builds an `UntypedFormGroup` from runtime field metadata.

```ts
const dynamicForm = forms.initializeFormGroup([
  {name: 'username', value: '', validations: [Validators.required]},
  {name: 'age', value: 18},
]);
```

Call `initializeFormGroup()` with no argument to create an empty untyped group. Missing values default to `null`.

### `resetFormGroup`

Resets the whole form, then applies optional default values to named controls.

```ts
forms.resetFormGroup(form, [
  {name: 'name', value: 'Anonymous'},
  {name: 'age', value: 18},
]);
```

Controls not listed use their normal Angular reset behavior. For non-nullable controls, that is their initial value.

### `getFormControlError`

Returns the raw value of any built-in or custom error, or `undefined` when the error is absent.

```ts
const serverError = forms.getFormControlError(form.controls.email, 'server');
```

Despite its name, this method returns error metadata rather than a human-readable message.

### `getFormControlErrorMessage`

Returns raw error metadata for a built-in Angular error name.

```ts
const requiredError = forms.getFormControlErrorMessage(
  form.controls.email,
  'required',
);
```

Supported names are `required`, `requiredTrue`, `minlength`, `maxlength`, `pattern`, `min`, `max`, and `email`. This original API remains fully supported.

### `hasControlMarks`

Returns `true` only when every requested control-state property is currently true. An empty marks array returns `false`.

```ts
const showError = forms.hasControlMarks(
  form.controls.email,
  ['touched', 'invalid'],
);
```

Supported marks are `dirty`, `pristine`, `touched`, `untouched`, `valid`, `invalid`, `pending`, `disabled`, and `enabled`.

### `isFormControlValidWithControlMark`

The original, fully supported name for the same behavior as `hasControlMarks`.

```ts
const showError = forms.isFormControlValidWithControlMark(
  form.controls.email,
  ['touched', 'invalid'],
);
```

### `isFormGroupValid`

Returns the form's current `valid` state.

```ts
if (forms.isFormGroupValid(form)) {
  // Submit the form.
}
```

### `getFormGroupErrorMessages`

Returns a map of top-level control names to their current `ValidationErrors`.

```ts
const errors = forms.getFormGroupErrorMessages(form);
// Example: {email: {required: true}}
```

Controls without errors are omitted. This method currently reports direct children only; it does not recursively flatten nested groups or arrays.

### `formatPayloadForSubmission`

Creates and transforms a copy of `form.value`. Formatting instructions form a discriminated union, so options required by `date` and `add` are compile-time checked.

```ts
const payload = forms.formatPayloadForSubmission(form, [
  {name: 'age', formatType: 'number'},
  {name: 'price', formatType: 'float'},
  {name: 'active', formatType: 'boolean'},
  {name: 'metadata', formatType: 'string'},
  {
    name: 'createdAt',
    formatType: 'date',
    dateFormat: 'yyyy-MM-dd',
    locale: 'en-US',
  },
  {name: 'source', formatType: 'add', value: 'web'},
  {name: 'confirmation', formatType: 'remove'},
]);
```

Supported formats:

- `string`: converts primitives with `String()` and objects with `JSON.stringify()`.
- `number`: accepts complete integer strings or finite numbers.
- `float`: accepts complete integer or decimal strings or finite numbers.
- `boolean`: accepts booleans, `1`, `0`, and the strings `"true"`, `"false"`, `"1"`, `"0"`.
- `date`: uses Angular's `formatDate`; `locale` defaults to `en-US`.
- `add`: adds or replaces a payload field.
- `remove`: removes a payload field.

Invalid numeric, boolean, or date inputs throw `TypeError` rather than silently producing a corrupted payload.

### `patchFormGroupValues`

Patches a form from an object and optionally maps source property names to form-control names. Returns the same form instance.

```ts
forms.patchFormGroupValues(form, {
  name: 'Lin',
  email: 'lin@example.com',
});

forms.patchFormGroupValues(
  form,
  {display_name: 'Lin'},
  [{name: 'name', mappedKey: 'display_name'}],
);
```

When a mapped source property is absent, the destination is patched with `undefined`.

### `markAllControlsAsTouched`

Marks every control, including nested descendants, as touched by using Angular's `markAllAsTouched()`.

```ts
forms.markAllControlsAsTouched(form);
```

### `addFormControl`

Adds a runtime-defined control to an `UntypedFormGroup`.

```ts
forms.addFormControl(
  dynamicForm,
  'nickname',
  new FormControl<string | null>(null),
);
```

For a statically typed group, use Angular's native `addControl()` with an optional key declared in the form's control model.

### `removeFormControl`

Removes a runtime-defined control from an `UntypedFormGroup`. Missing controls are ignored.

```ts
forms.removeFormControl(dynamicForm, 'nickname');
```

For a statically typed group, use Angular's native `removeControl()` with an optional key declared in the form's control model.

## Validator API

### `fieldsMatch`

Returns an Angular group-level `ValidatorFn`. It automatically re-evaluates when either child control changes.

```ts
import {fieldsMatch} from '@ngx-boilerplate-functions/forms';

const passwordForm = new FormGroup(
  {
    password: new FormControl('', {nonNullable: true}),
    confirmation: new FormControl('', {nonNullable: true}),
  },
  {validators: fieldsMatch('password', 'confirmation')},
);

// When values differ:
// passwordForm.errors === {
//   fieldsMismatch: {first: 'password', second: 'confirmation'}
// }
```

If either named control does not exist, the validator returns `null`.

## Public types

All of the following are exported from `@ngx-boilerplate-functions/forms`:

| Type | Purpose |
|---|---|
| `IFormsFunctionsService` | Public service contract for abstractions, mocks, and test doubles. |
| `IFormFieldInfo` | Backwards-compatible aggregate field description. Focused input types are preferred for new code. |
| `FormControlMark` | Union of supported state properties for the mark-checking methods. |
| `BuiltInValidationError` | Union of supported built-in error names. |
| `FormFieldName<TForm>` | Extracts string control names from a typed form. |
| `FormRawValue<TForm>` | Extracts the form's raw-value type. |
| `ControlValue<TControl>` | Extracts a control's value type. |
| `FormGroupValidationInput<TName>` | Input for assigning validators. |
| `RemoveFormGroupValidationInput<TName>` | Base input for removing validators. |
| `TypedRemoveValidationInput<TForm>` | Typed field name and default value for validator removal. |
| `CommonFieldInput<TValue, TName>` | Generic name/value field description. |
| `TypedCommonFieldInput<TForm>` | Name/value union derived from a typed form. |
| `DisableFieldInput<TName>` | Field name plus Angular disable options. |
| `InitializeFormGroupInput<TValue>` | Runtime control name, initial value, and validators. |
| `RemoveControlInput` | Runtime control name plus `emitEvent`. |
| `FormatFieldInput` | Discriminated payload-formatting instruction union. |
| `MappedKeysInput<TName>` | Destination form name and source object key. |
| `FormGroupErrorMessages` | `Record<string, ValidationErrors>`. |

## Migration from 0.0.x

- Replace imports from `ngx-form-boilerplate` with `@ngx-boilerplate-functions/forms`.
- Replace `FormGroup | any` declarations with inferred or explicitly typed `FormGroup` models.
- Call `initializeFormGroup(fields)` without a `FormBuilder` argument.
- `getFormControlErrorMessage` and `isFormControlValidWithControlMark` remain supported; their shorter alternatives are optional.
- `checkIfFormControlsMatch` remains supported; `fieldsMatch` is available for automatic validation.
- Use `preserveErrors: ['server']` when selected manual errors must survive validator recalculation.

No documented API has a planned removal version.

## Development

Use the Node version in `.nvmrc`, then run:

```sh
nvm use
npm ci
npm run typecheck
npm test
npm run build
npm run pack:check
```

## License

MIT
