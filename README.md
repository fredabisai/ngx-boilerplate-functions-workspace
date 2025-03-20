# ngx-form-boilerplate

## Overview
**ngx-form-boilerplate** is a utility package designed to simplify form handling in Angular applications. It provides helper functions for managing `FormGroup` and `FormControl` operations efficiently.

## Installation

To install the package, use npm or yarn:

```sh
npm install ngx-form-boilerplate
```

or

```sh
yarn add ngx-form-boilerplate
```

## Usage

### Importing in an Angular Service or Component

```typescript
import { FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { IFormFieldInfo } from 'ngx-form-boilerplate';
```

Inject the service into your component:

```typescript
constructor(private formService: FormsFunctionsService) {}
```

## Interface: `IFormFieldInfo`
This interface defines the structure for form fields.

```typescript
export interface IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean };
  formatType?: 'string' | 'number' | 'float' | 'boolean' | 'date' | 'remove' | 'add';
  dateFormat?: string;
  mappedKey?: string;
}
```

### Description of Properties
- `name`: The field name (required).
- `validations?`: An array of Angular validation functions.
- `defaultValue?`: The default value of the field.
- `value?`: The current value of the field.
- `options?`: Additional options like `onlySelf` and `emitEvent`.
- `formatType?`: Defines how the value should be formatted (`string`, `number`, `date`, etc.).
- `dateFormat?`: Specifies a date format when `formatType` is set to `date`.
- `mappedKey?`: Defines a different key for mapping data.



## API Reference

### 1. `initializeFormGroup`

#### Description
Initializes a `FormGroup` or `UntypedFormGroup` based on the provided fields.

#### Parameters
- `formBuilder: FormBuilder | UntypedFormBuilder` - The form builder instance.
- `fields: IFormFieldInfo[]` - An array of field definitions.

#### Returns
`FormGroup | UntypedFormGroup | undefined` - The initialized form group.

#### Example
```typescript
const form = this.formService.initializeFormGroup(this.fb, [
  { name: 'username', value: '', validations: [Validators.required] },
]);
```

---
### 2. `resetFormGroup`

#### Description
Resets the form to its initial state or with provided default field values.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `defaultFields?: IFormFieldInfo[]`

#### Example
```typescript
this.formService.resetFormGroup(this.form);
```

---
### 3. `checkIfFormControlsMatch`

#### Description
Validates if two form controls match (e.g., password confirmation).

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `controlName: string`
- `matchingControlName: string`

#### Example
```typescript
this.formService.checkIfFormControlsMatch(this.form, 'password', 'confirmPassword');
```

---
### 4. `getFormControlErrorMessage`

#### Description
Retrieves error messages for a specific form control.

#### Parameters
- `control: FormControl | UntypedFormControl`
- `errorType: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email'`

#### Example
```typescript
const errorMessage = this.formService.getFormControlErrorMessage(this.form.get('email'), 'required');
```

---
### 5. `isFormGroupValid`

#### Description
Checks if the entire form group is valid.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`

#### Returns
`boolean`

#### Example
```typescript
const isValid = this.formService.isFormGroupValid(this.form);
```

---
### 6. `markAllControlsAsTouched`

#### Description
Marks all form controls as touched.

#### Parameters
- `form: FormGroup | UntypedFormGroup`

#### Example
```typescript
this.formService.markAllControlsAsTouched(this.form);
```

---
### 7. `addFormControl`

#### Description
Dynamically adds a form control to an existing form group.

#### Parameters
- `form: FormGroup | UntypedFormGroup`
- `controlName: string`
- `control: FormControl | UntypedFormControl`

#### Example
```typescript
this.formService.addFormControl(this.form, 'newField', new FormControl('value'));
```

---
### 8. `removeFormControl`

#### Description
Removes a form control from the form group.

#### Parameters
- `form: FormGroup`
- `controlName: string`

#### Example
```typescript
this.formService.removeFormControl(this.form, 'username');
```

---
### 9. `patchFormGroupValues`

#### Description
Patches values to a form group, optionally mapping field names.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `data: any`
- `mappedKeys?: IFormFieldInfo[]`

#### Example
```typescript
this.formService.patchFormGroupValues(this.form, { username: 'JohnDoe' });
```

### 10. `setFormGroupValidations`

#### Description
Dynamically sets validation rules for form controls.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fields: IFormFieldInfo[]`

#### Example
```typescript
setFormGroupValidations(form, [
  { name: 'email', validations: [Validators.required, Validators.email] },
  { name: 'password', validations: [Validators.required, Validators.minLength(6)] }
]);
```

### 11. `removeFormGroupValidations`

#### Description
Removes validations from specified form controls and resets their values to default or null.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fields: IFormFieldInfo[]`

#### Example
```typescript
removeFormGroupValidations(form, [
  { name: 'email', defaultValue: 'user@example.com' },
  { name: 'password' }
]);
```

### 12. `addAndRemoveFieldsOnSubmission`

#### Description
Adds or removes specific fields in the form payload before submission.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToAdd: IFormFieldInfo[]`
- `fieldsToRemove: string[]`

#### Example
```typescript
const payload = {
  name: 'Donald Olmo',
  address: 'Portland',
}
const fieldsToAdd: IFormFieldInfo[] = [
  { name: 'email', value: 'user@example.com' }]
const fieldsToRemove = ['address']
const updatedPayload = addAndRemoveFieldsOnSubmission(form, 
  fieldsToAdd,fieldsToRemove);
console.log(updatedPayload);
```

#### Result
```typescript
   {
    "name": "Donald Olmo", "email": "user@example.com"
    }
```
### 12. `addAndRemoveFieldsOnSubmission`

#### Description
Adds or removes specific fields in the form payload before submission.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToAdd: IFormFieldInfo[]`
- `fieldsToRemove: string[]`

#### Example
```typescript
const payload = {
  name: 'Donald Olmo',
  address: 'Portland',
}
const fieldsToAdd: IFormFieldInfo[] = [
  { name: 'email', value: 'user@example.com' }]
const fieldsToRemove = ['address']
const updatedPayload = addAndRemoveFieldsOnSubmission(form, 
  fieldsToAdd,fieldsToRemove);
console.log(updatedPayload);
```

#### Result
```typescript
   {
    "name": "Donald Olmo", "email": "user@example.com"
    }
```

## Contributing
Feel free to submit issues or pull requests on GitHub to improve the package.

## License
This package is released under the MIT License.

