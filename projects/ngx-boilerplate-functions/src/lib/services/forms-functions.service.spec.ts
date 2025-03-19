import { FormsFunctionsService } from './forms-functions.service';
import {FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import { IFormFieldInfo } from "../interfaces/ngx-boilerplate-functions.interface";
import {PackageUtils} from "../utils/package.utils";

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
    console.log(form?.value)
    form.addControl('fieldToRemove', new FormControl('toBeRemoved'));
    console.log(form?.value)
    const fieldsToRemove = [{ name: 'fieldToRemove', emitEvent: false }];

    service.changeFormControlFields(form, [], fieldsToRemove);
    console.log(form?.value)

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
