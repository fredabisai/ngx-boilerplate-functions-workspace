import { FormsFunctionsService } from './forms-functions.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { IFormFieldInfo } from "../interfaces/ngx-boilerplate-functions.interface";

describe('FormsFunctionsService', () => {
  let service: FormsFunctionsService;
  let form: FormGroup;
  let formBuilder: FormBuilder;

  let untypedForm: UntypedFormGroup;

  beforeEach(() => {
    service = new FormsFunctionsService();
    formBuilder = new FormBuilder();
    form = formBuilder.group({
      name: [''],
      email: [''],
      age: ['']
    });
    untypedForm = new UntypedFormGroup({});
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('[setFormGroupValidations]: should set validators on specified form fields', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', validations: [Validators.required] },
      { name: 'email', validations: [Validators.email, Validators.required] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.get('name')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('email')?.hasValidator(Validators.email)).toBeTruthy();
    expect(form.get('email')?.hasValidator(Validators.required)).toBeTruthy();
  });

  test('[setFormGroupValidations]: should not change validations for fields not listed', () => {
    const initialValidator = form.get('age')?.validator;
    service.setFormGroupValidations(form, [{ name: 'name', validations: [Validators.required] }]);
    expect(form.get('age')?.validator).toBe(initialValidator);
  });

  test('[setFormGroupValidations]: should handle fields that do not exist in the form', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'nonExistentField', validations: [Validators.required] }
    ];

    service.setFormGroupValidations(form, fields);
    expect(form.contains('nonExistentField')).toBeFalsy();
  });

  test('[setFormGroupValidations]: should update value and validity after setting validators', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', validations: [Validators.required] }
    ];
    const nameControl = form.get('name');
    jest.spyOn(nameControl!, 'updateValueAndValidity');

    service.setFormGroupValidations(form, fields);
    expect(nameControl!.updateValueAndValidity).toHaveBeenCalled();
  });

  test('[removeFormGroupValidations]: should remove validations and set default values for specified fields', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', defaultValue: 'defaultName' },
      { name: 'email', defaultValue: 'defaultEmail' },
    ];

    service.removeFormGroupValidations(form, fields);
    expect(form.get('name')?.validator).toBeNull();
    expect(form.get('email')?.validator).toBeNull();
    expect(form.get('name')?.value).toBe('defaultName');
    expect(form.get('email')?.value).toBe('defaultEmail');
  });

  test('[disableFields]: should disable specified fields', () => {
    const fieldsToDisable: IFormFieldInfo[] = [
      { name: 'name' },
      { name: 'email' },
    ];
    service.disableFields(form, fieldsToDisable);
    expect(form.get('name')?.disabled).toBeTruthy();
    expect(form.get('email')?.disabled).toBeTruthy();
  });

  test('[patchValuesToFields]: should patch values to specified fields', () => {
    const fieldsToSet: IFormFieldInfo[] = [
      { name: 'name', value: 'John' },
      { name: 'email', value: 'john@example.com' },
    ];

    service.patchValuesToFields(form, fieldsToSet);
    expect(form.get('name')?.value).toBe('John');
    expect(form.get('email')?.value).toBe('john@example.com');
  });

  test('[addAndRemoveFieldsOnSubmission] should return the form value as is when no fields are added or removed', () => {
    const formValue = {age: 10, name: 'John', email: 'john@example.com'};
    form.patchValue(formValue)
    const result = service.addAndRemoveFieldsOnSubmission(form);
    expect(result).toEqual(formValue);
  });

  test('[addAndRemoveFieldsOnSubmission] should add fields to the form payload', () => {
    const formValue = {age: 10, name: 'John', email: 'john@example.com'};
    form.patchValue(formValue)
    const fieldsToAdd: IFormFieldInfo[] = [{ name: 'address', value: '23 Street' }];

    const result = service.addAndRemoveFieldsOnSubmission(form, fieldsToAdd);
    expect(result).toEqual({ ...formValue, [fieldsToAdd[0].name]: fieldsToAdd[0].value });
  });

  test('[addAndRemoveFieldsOnSubmission] should remove specified fields from the form payload', () => {
    const formValue = {age: 10, name: 'John', email: 'john@example.com'};
    form.patchValue(formValue)
    const fieldsToRemove = ['email'];
    const result = service.addAndRemoveFieldsOnSubmission(form, [], fieldsToRemove);
    expect(result).toEqual({age: 10, name: 'John'});
  });

  test('[addAndRemoveFieldsOnSubmission] should add and remove fields simultaneously', () => {
    const formValue = {age: 10, name: 'John', email: 'john@example.com'};
    form.patchValue(formValue)
    const fieldsToAdd: IFormFieldInfo[] = [{ name: 'address', value: '23 street' }];
    const fieldsToRemove = ['email'];
    const result = service.addAndRemoveFieldsOnSubmission(form, fieldsToAdd, fieldsToRemove);
    expect(result).toEqual({ ...{age: 10, name: 'John'}, [fieldsToAdd[0].name]: fieldsToAdd[0].value });
  });

  test('[addAndRemoveFieldsOnSubmission] should handle an empty form', () => {
    const emptyForm = new FormGroup({});
    const fieldsToAdd: IFormFieldInfo[] = [{ name: 'addedField', value: 'addedValue' }];
    const fieldsToRemove = ['nonExistingField'];
    const result = service.addAndRemoveFieldsOnSubmission(emptyForm, fieldsToAdd, fieldsToRemove);
    expect(result).toEqual({ addedField: 'addedValue' });
  });

  test('[addAndRemoveFieldsOnSubmission] should not modify the payload if null fields are added or removed', () => {
    const formValue = {age: 10, name: 'John', email: 'john@example.com'};
    form.patchValue(formValue)
    const result = service.addAndRemoveFieldsOnSubmission(form, null as any, null as any);
    expect(result).toEqual(formValue);
  });
  it('[changeFormControlFields] should add new fields to a FormGroup', () => {
    // (PackageUtils.isFormGroup as jest.Mock).mockReturnValue(true);
    const fieldsToAdd = [{ name: 'testField', value: 'testValue', validations: [] }];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.contains('testField')).toBe(true);
    expect(form.get('testField')?.value).toBe('testValue');
  });

  it('[changeFormControlFields] should add new fields to an UntypedFormGroup', () => {
    // (PackageUtils.isUntypedFormGroup as jest.Mock).mockReturnValue(true);
    const fieldsToAdd = [{ name: 'untypedField', value: 'untypedValue', validations: [] }];

    service.changeFormControlFields(untypedForm, fieldsToAdd, []);

    expect(untypedForm.contains('untypedField')).toBe(true);
    expect(untypedForm.get('untypedField')?.value).toBe('untypedValue');
  });

  it('[changeFormControlFields] should not add a field if it already exists in FormGroup', () => {
    form.addControl('existingField', new FormControl('existingValue'));
    const fieldsToAdd = [{ name: 'existingField', value: 'newValue', validations: [] }];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.get('existingField')?.value).toBe('existingValue'); // Value should remain unchanged
  });

  it('[changeFormControlFields] should remove fields from a FormGroup', () => {
    form.addControl('fieldToRemove', new FormControl('toBeRemoved'));
    const fieldsToRemove = [{ name: 'fieldToRemove', emitEvent: false }];

    service.changeFormControlFields(form, [], fieldsToRemove);

    expect(form.contains('fieldToRemove')).toBe(false);
  });

  it('[changeFormControlFields] should remove fields from an UntypedFormGroup', () => {
    untypedForm.addControl('fieldToRemove', new UntypedFormControl('toBeRemoved'));
    const fieldsToRemove = [{ name: 'fieldToRemove', emitEvent: false }];

    service.changeFormControlFields(untypedForm, [], fieldsToRemove);

    expect(untypedForm.contains('fieldToRemove')).toBe(false);
  });

  it('[changeFormControlFields] should add multiple fields to a FormGroup', () => {
    // (PackageUtils.isFormGroup as jest.Mock).mockReturnValue(true);
    const fieldsToAdd = [
      { name: 'field1', value: 'value1', validations: [] },
      { name: 'field2', value: 'value2', validations: [] }
    ];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.contains('field1')).toBe(true);
    expect(form.get('field1')?.value).toBe('value1');
    expect(form.contains('field2')).toBe(true);
    expect(form.get('field2')?.value).toBe('value2');
  });

  it('[changeFormControlFields] should remove multiple fields from a FormGroup', () => {
    form.addControl('field1', new FormControl('value1'));
    form.addControl('field2', new FormControl('value2'));
    const fieldsToRemove = [
      { name: 'field1', emitEvent: false },
      { name: 'field2', emitEvent: false }
    ];

    service.changeFormControlFields(form, [], fieldsToRemove);

    expect(form.contains('field1')).toBe(false);
    expect(form.contains('field2')).toBe(false);
  });

});


describe('checkIfFormControlsMatch', () => {
  let service: FormsFunctionsService;
  let formGroup: FormGroup;

  beforeEach(() => {
    service = new FormsFunctionsService();
    formGroup = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  })
  it('should set mustMatch error if values do not match', () => {
    formGroup.controls['password'].setValue('123456');
    formGroup.controls['confirmPassword'].setValue('654321');

    service.checkIfFormControlsMatch(formGroup, 'password', 'confirmPassword');

    expect(formGroup.controls['confirmPassword'].errors).toEqual({ mustMatch: true });
  });

  it('should remove mustMatch error if values match', () => {
    formGroup.controls['password'].setValue('123456');
    formGroup.controls['confirmPassword'].setValue('123456');

    service.checkIfFormControlsMatch(formGroup, 'password', 'confirmPassword');

    expect(formGroup.controls['confirmPassword'].errors).toBeNull();
  });

  it('should not override other errors if present on matchingControl', () => {
    formGroup.controls['password'].setValue('123456');
    formGroup.controls['confirmPassword'].setValue('654321');
    formGroup.controls['confirmPassword'].setErrors({ required: true });

    service.checkIfFormControlsMatch(formGroup, 'password', 'confirmPassword');

    expect(formGroup.controls['confirmPassword'].errors).toEqual({ required: true });
  });

});

describe('initializeFormGroup', () => {
  let formBuilder: FormBuilder;
  let untypedFormBuilder: UntypedFormBuilder;
  let service: FormsFunctionsService;

  beforeEach(() => {
    service = new FormsFunctionsService();
    formBuilder = new FormBuilder();
    untypedFormBuilder = new UntypedFormBuilder();
  });


  it('should return an empty FormGroup if no fields are provided', () => {
    const formGroup = service.initializeFormGroup(formBuilder, []);
    expect(formGroup).toBeInstanceOf(FormGroup);
    expect(Object.keys(formGroup?.controls || {})).toHaveLength(0);
  });

  it('should create a FormGroup with fields and default values', () => {
    const fields = [
      { name: 'username', value: 'testuser' },
      { name: 'email', value: 'user@example.com' }
    ];
    const formGroup = service.initializeFormGroup(formBuilder, fields) as FormGroup;

    expect(formGroup).toBeInstanceOf(FormGroup);
    expect(formGroup.controls['username'].value).toBe('testuser');
    expect(formGroup.controls['email'].value).toBe('user@example.com');
  });

  it('should use UntypedFormGroup when UntypedFormBuilder is provided', () => {
    const fields = [{ name: 'age', value: 25 }];
    const formGroup = service.initializeFormGroup(untypedFormBuilder, fields) as UntypedFormGroup;

    expect(formGroup).toBeInstanceOf(UntypedFormGroup);
    expect(formGroup.controls['age'].value).toBe(25);
  });

  it('should handle missing field values by falling back to defaultValue or null', () => {
    const fields = [
      { name: 'firstName' },
      { name: 'lastName', value: 'Doe' }
    ];
    const formGroup = service.initializeFormGroup(formBuilder, fields) as FormGroup;

    expect(formGroup.controls['firstName'].value).toBeNull();
    expect(formGroup.controls['lastName'].value).toBe('Doe');
  });
});

describe('Form Utility Functions', () => {
  let formGroup: FormGroup;
  let untypedFormGroup: UntypedFormGroup;
  let service: FormsFunctionsService;

  beforeEach(() => {
    service = new FormsFunctionsService();
    formGroup = new FormGroup({
      name: new FormControl('John'),
      age: new FormControl(25)
    });

    untypedFormGroup = new UntypedFormGroup({
      email: new UntypedFormControl('test@example.com')
    });
  });

  it('should reset form group without default fields', () => {
    formGroup.controls['name'].setValue('Mike');
    service.resetFormGroup(formGroup);
    expect(formGroup.controls['name'].value).toBeNull();
  });

  it('should reset form group with default fields', () => {
    service.resetFormGroup(formGroup, [{ name: 'name', value: 'Default' }]);
    expect(formGroup.controls['name'].value).toBe('Default');
  });

  it('should return form control error message if it exists', () => {
    formGroup.controls['name'].setErrors({ required: true });
    expect(service.getFormControlErrorMessage(formGroup.controls['name'], 'required')).toEqual(true);
  });

  it('should return undefined if no error exists on form control', () => {
    expect(service.getFormControlErrorMessage(formGroup.controls['name'], 'required')).toBeUndefined();
  });

  // it('should return false if control or controlMarks are missing', () => {
  //   expect(service.isFormControlValidWithControlMark(null, ['dirty'])).toBe(false);
  // });

  it('should validate control with multiple marks', () => {
    formGroup.controls['name'].markAsTouched();
    expect(service.isFormControlValidWithControlMark(formGroup.controls['name'], ['touched'])).toBeTruthy();
  });

  it('should return true if form group is valid', () => {
    expect(service.isFormGroupValid(formGroup)).toBeTruthy();
  });

  it('should return false if form group is invalid', () => {
    formGroup.controls['name'].setErrors({ required: true });
    expect(service.isFormGroupValid(formGroup)).toBeFalsy();
  });

  it('should return error messages for invalid form controls', () => {
    formGroup.controls['name'].setErrors({ required: true });
    expect(service.getFormGroupErrorMessages(formGroup)).toEqual({ name: { required: true } });
  });

  it('should return an unchanged object if no formatting fields are provided', () => {
    const payload = service.formatPayloadForSubmission(formGroup, []);
    expect(payload).toEqual(formGroup.value);
  });

  it('should remove a key from object when formatType is "remove"', () => {
    const formattedPayload = service.formatPayloadForSubmission(formGroup, [{ name: 'name', formatType: 'remove' }]);
    expect(formattedPayload).not.toHaveProperty('name');
  });

  it('should patch values to the form group', () => {
    service.patchFormGroupValues(formGroup, { name: 'Alice', age: 30 });
    expect(formGroup.controls['name'].value).toBe('Alice');
    expect(formGroup.controls['age'].value).toBe(30);
  });

  it('should mark all controls as touched', () => {
    service.markAllControlsAsTouched(formGroup);
    expect(formGroup.get('name')?.touched).toBeTruthy();
    expect(formGroup.get('age')?.touched).toBeTruthy();
  });

  it('should add a form control', () => {
    const newControl = new FormControl('New Value');
    service.addFormControl(formGroup, 'newField', newControl);
    expect(formGroup.get('newField')?.value).toBe('New Value');
  });

  it('should remove an existing form control', () => {
    service.removeFormControl(formGroup, 'name');
    expect(formGroup.contains('name')).toBeFalsy();
  });

  it('should not remove a non-existent control', () => {
    service.removeFormControl(formGroup, 'nonExistent');
    expect(formGroup.contains('name')).toBeTruthy(); // Ensuring no impact on existing controls
  });
});


