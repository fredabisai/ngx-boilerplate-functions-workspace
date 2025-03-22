# @ngx-boilerplate-functions/forms

## Overview
**@ngx-boilerplate-functions/forms**  is a utility package designed to simplify form handling in Angular applications. It provides helper functions for managing `FormGroup` and `FormControl` operations efficiently.

## Installation

To install the package, use npm or yarn:

```sh
npm install @ngx-boilerplate-functions/forms
```

or

```sh
yarn add @ngx-boilerplate-functions/forms
```

## Usage

### Importing in an Angular Service or Component

```typescript
import { FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/formss';
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
- `fields: InitializeFormGroupInput[]` - An array of field definitions.
```typescript
export type InitializeFormGroupInput = {
  name: string;
  value?: any;
  validations?: ValidatorFn[];
}
```

#### Returns
`FormGroup | UntypedFormGroup | undefined` - The initialized form group.

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, InitializeFormGroupInput} from "@ngx-boilerplate-functions/forms";


export class TestingComponent {
  form: UntypedFormGroup;
  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {}
  initializeFormGroup() {
    const fields: InitializeFormGroupInput[] = [
      { name: 'username', value: '', validations: [Validators.required] },
    ]
    this.form = this.formService.initializeFormGroup(this.fb, fields);
  }
}
```

---
### 2. `resetFormGroup`

#### Description
Resets the form to its initial state or with provided default field values.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `defaultFields?: CommonFieldInput[]`
```typescript
export type CommonFieldInput = {
  name: string;
  value?: any;
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, CommonFieldInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: ['Donald Olmo', [Validators.required]],
      address: ['Portland', [Validators.required]]
    })
  }
  resetFormGroup() {
    const defaultFields: CommonFieldInput[] = [
      { name: 'name'},
      { name: 'address', value: '-'}
    ]
    this.formService.resetFormGroup(this.form, defaultFields);
    console.log(this.form.value)
  }
}
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
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: ['123456', [Validators.required]],
      confirmPassword: ['654321', [Validators.required]]
    })
  }

  checkIfFormControlsMatch() {
    this.formService.checkIfFormControlsMatch(this.form, 'password', 'confirmPassword');
    console.log(this.form.controls['confirmPassword'].errors)
  }
}
```
#### Result
```typescript
   { mustMatch: true }
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
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  getFormControlErrorMessage() {
    const errorMessage = this.formService.getFormControlErrorMessage(this.form.get('email'), 'required');
    console.log(errorMessage)
  }
}
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
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  isFormControlValidWithControlMark(): boolean {
    const isValid = this.formService.isFormGroupValid(this.form);
    console.log(isValid)
  }
}
```

---
### 6. `markAllControlsAsTouched`

#### Description
Marks all form controls as touched.

#### Parameters
- `form: FormGroup | UntypedFormGroup`

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  markAllControlsAsTouched() {
    this.formService.markAllControlsAsTouched(this.form);
    console.log(this.form.get('email')?.touched)
  }
}
```
#### Result
```typescript
true
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
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  addFormControl() {
    this.formService.addFormControl(this.form, 'address', new FormControl('Dar es Salaam'));
    console.log(this.form.contains('address'));
    console.log(this.form.get('address').value);
  }
}
```
#### Result
```text
 true
 Dar es Salaam
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
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  removeFormControl() {
    this.formService.removeFormControl(this.form, 'password');
    console.log(this.form.contains('password'));
  }
}
```
#### Result
```typescript
 false
```

---
### 9. `patchFormGroupValues`

#### Description
Patches values to a form group, optionally mapping field names using passed payload.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `data: any`
- `mappedKeys?: MappedKeysInput[]`
```typescript
export type MappedKeysInput = {
  name: string;
  mappedKey?: string;
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, MappedKeysInput} from "@ngx-boilerplate-functions/forms";


export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      email: [null],
      name: [null],
      address: [null]
    })
  }

  patchFormGroupValues() {
    const data = {
      myEmail: 'user@example.com',
      name: 'New User',
      address: 'Dar es Salaam'
    }
  
    const mappedKeys: MappedKeysInput[] = [{name: 'email', mappedKey: 'myEmail'];
    this.formService.patchFormGroupValues(this.form, data, mappedKeys);
    console.log(this.form.value);
  }
}
```
#### Result
```json
  {
  "email": "user@example.com",
  "name": "New User",
  "address": "Dar es Salaam"
}
```

### 10. `setFormGroupValidations`

#### Description
Dynamically sets validation rules for form controls.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fields: FormGroupValidationInput[]`
```typescript
export type FormGroupValidationInput = {
  name: string;
  validations?: ValidatorFn[];
}
```

#### Example

```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, FormGroupValidationInput} from "@ngx-boilerplate-functions/forms";


export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder) {
    this.form = this.fb.group({
      email: [null],
      password: [null]
    })
  }

  setFormGroupValidations() {
    const fields: FormGroupValidationInput[] = [
      {name: 'email', validations: [Validators.required, Validators.email]},
      {name: 'password', validations: [Validators.required, Validators.minLength(6)]}
    ]
    this.formService.setFormGroupValidations(this.form, fields);
  }
}
```

### 11. `removeFormGroupValidations`

#### Description
Removes validations from specified form controls and resets their values to default or null.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fields: RemoveFormGroupValidationInput[]`
```typescript
export type RemoveFormGroupValidationInput = {
  name: string;
  defaultValue?: any;
}
```

#### Example

```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, RemoveFormGroupValidationInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  removeFormGroupValidations() {
    const fields: RemoveFormGroupValidationInput[] = [
      {name: 'email', defaultValue: 'user@example.com'},
      {name: 'password'}
    ]
    this.formService.removeFormGroupValidations(this.form, fields);
  }
}
```
Field email will have a default value of user@example.com

### 12. `addAndRemoveFieldsOnSubmission`

#### Description
Adds or removes specific fields in the form payload before submission.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToAdd: CommonFieldInput[]`
- `fieldsToRemove: string[]`
```typescript
export type CommonFieldInput = {
  name: string;
  value?: any;
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, CommonFieldInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: ['Donald Olmo', [Validators.required]],
      address: ['Portland', [Validators.required]]
    })
  }
  addAndRemoveFieldsOnSubmission() {
    const fieldsToAdd: CommonFieldInput[] = [{name: 'email', value: 'user@example.com'}]
    const fieldsToRemove = ['address']
    const updatedPayload = this.formService.addAndRemoveFieldsOnSubmission(this.form, fieldsToAdd, fieldsToRemove);
    console.log(updatedPayload);
  }
}
```

#### Result
```typescript
   {
    "name": "Donald Olmo", "email": "user@example.com"
    }
```
### 13. `disableFields`

#### Description
Disable specified field in a FormGroup or UntypedFormGroup.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToDisable: DisableFieldInput[]`
```typescript
export type DisableFieldInput = {
  name: string;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, DisableFieldInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: ['Donald Olmo', [Validators.required]],
      address: ['Portland', [Validators.required]]
    })
  }
  disableFields() {
    const fieldsToDisable: DisableFieldInput[] = [
      { name: 'name'},
      { name: 'address', options: { onlySelf: true, emitEvent: true }}
    ]
    this.formService.disableFields(this.form, fieldsToDisable);
  }
}
```

#### Result
```typescript
   {
    "name": "Donald Olmo", "email": "user@example.com"
    }
```
### 14. `patchValuesToFields`

#### Description
Set values to fields in the FormGroup / UntypedFormGroup.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToSet: CommonFieldInput[]`
```typescript
export type CommonFieldInput = {
  name: string;
  value?: any;
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, CommonFieldInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]]
    })
  }
  patchValuesToFields() {
    const fieldsToSet: CommonFieldInput[] = [{name: 'name', value: 'John Doe'}, 
                                             {name: 'address', value: 'Dar es Salaam'}]
    this.formService.patchValuesToFields(this.form, fieldsToSet);
    console.log(this.form.value);
  }
}
```
#### Result
```typescript
   {
    "name": "John Doe", "address": "Dar es Salaam"
    }
```
### 15. `changeFormControlFields`

#### Description
Add or/and remove fields in the FormGroup / UntypedFormGroup.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToAdd: InitializeFormGroupInput[]`
- `fieldsToRemove: {name: string, emitEvent?: boolean}[]`
```typescript
export type InitializeFormGroupInput = {
  name: string;
  value?: any;
  validations?: ValidatorFn[];
}
```
---
#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, InitializeFormGroupInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]]
    })
  }
  changeFormControlFields() {
    const fieldsToAdd: InitializeFormGroupInput[] = [{name: 'email', value: 'user@example.com', validations: [Validators.required]}, 
                                             {name: 'address', value: 'Dar es Salaam'}]
    const fieldsToRemove: {name: string, emitEvent?: boolean}[] = [{ name: 'address', emitEvent: true }]
    this.formService.changeFormControlFields(this.form, fieldsToAdd, fieldsToRemove);
    console.log(this.form.value);
  }
}
```
---
### 16. `isFormControlValidWithControlMark`

#### Description
Check form control is valid using control marks.

#### Parameters
- `control: FormControl | UntypedFormControl`
- `controlMarks: ('dirty' | 'pristine' | 'touched' | 'invalid')[]`

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  isFormControlValidWithControlMark(): boolean {
    const isValid = this.formService.isFormControlValidWithControlMark(this.form.get('email'), ['dirty', 'pristine']);
    console.log(isValid)
  }
}
```

---

### 17. `getFormGroupErrorMessages`

#### Description
Get error messages from FormGroup or UntypedFormGroup.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService } from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    })
  }

  getFormGroupErrorMessages(): boolean {
    const errors = this.formService.getFormGroupErrorMessages(this.form);
    console.log(errors)
  }
}
```
#### Result
```json
  {
    "email": ["Email is required", "Email should be valid email"],
     "password": ["Password is required"]
  }
```

---

### 18. `formatPayloadForSubmission`

#### Description
Formats to specified type or format, assigns value and removes specific fields in the form payload before submission.

#### Parameters
- `formGroup: FormGroup | UntypedFormGroup`
- `fieldsToFormat: FormatFieldInput[]`
```typescript
export type FormatFieldInput = {
  name: string;
  formatType?:  'string' | 'number' | 'float' | 'boolean' | 'date' |  'remove' | 'add';
  dateFormat?: string;
  value?: any;
}
```

#### Example
```typescript
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from "@angular/formss";
import {FormsFunctionsService, FormatFieldInput} from "@ngx-boilerplate-functions/forms";

export class TestingComponent {
  form: UntypedFormGroup;

  constructor(private formService: FormsFunctionsService,
              private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      name: ['Donald Olmo', [Validators.required]],
      address: ['Portland', [Validators.required]],
      year: [1990, [Validators.required]]
    })
  }
  formatPayloadForSubmission() {
    const fieldsToFormat: FormatFieldInput[] = [{name: 'year', formatType: 'string'}]
    const updatedPayload = this.formService.formatPayloadForSubmission(this.form, fieldsToFormat);
    console.log(updatedPayload);
  }
}
```

#### Result

```json
{
  "name": "Donald Olmo",
  "email": "user@example.com",
  "year": "1990"
}
```

## Contributing
Feel free to submit issues or pull requests on GitHub to improve the package.

## License
This package is released under the MIT License.

