import { TestBed } from '@angular/core/testing';

import { FormsFunctionsService } from './forms-functions.service';
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {IFormFieldInfo} from "../interfaces/ngx-boilerplate-functions.interface";

describe('FormsFunctionsService', () => {
  let service: FormsFunctionsService;
  let form: FormGroup;
  let fieldsForm: FormGroup;

  let passwordForm: UntypedFormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsFunctionsService);
    form = new FormBuilder().group({
      name: [''],
      email: [''],
      age: ['']
    });
    form = new FormBuilder().group({
      field1: [null, [Validators.required]],
      field2: [null, [Validators.required, Validators.minLength(3)]],
      field3: [null], // no initial validation
    });
  });
  const formBuilder = new FormBuilder();

  passwordForm = new UntypedFormGroup({
    password: formBuilder.control(''),
    confirmPassword: formBuilder.control(''),
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('[setFormFieldsValidations]: should set validators on specified form fields', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', validations: [Validators.required] },
      { name: 'email', validations: [Validators.email, Validators.required] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.get('name')!.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('email')!.hasValidator(Validators.email)).toBeTrue();
    expect(form.get('email')!.hasValidator(Validators.required)).toBeTrue();
  });

  it('[setFormFieldsValidations]: should not change validations for fields not listed', () => {
    const initialValidator = form.get('age')!.validator;

    service.setFormGroupValidations(form, [{ name: 'name', validations: [Validators.required] }]);

    expect(form.get('age')!.validator).toBe(initialValidator);
  });

  it('[setFormFieldsValidations]: should handle fields that do not exist in the form', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'nonExistentField', validations: [Validators.required] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.contains('nonExistentField')).toBeFalse();
  });

  it('[setFormFieldsValidations]: should skip fields with empty or undefined validations array', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', validations: [] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.get('name')!.validator).toBeNull();
  });

  it('[setFormFieldsValidations]: should update value and validity after setting validators', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'name', validations: [Validators.required] }
    ];

    spyOn(form.get('name')!, 'updateValueAndValidity');

    service.setFormGroupValidations(form, fields);

    expect(form.get('name')!.updateValueAndValidity).toHaveBeenCalled();
  });

  it('[setFormFieldsValidations]: should not throw errors if form is null', () => {
    expect(() => service.setFormGroupValidations(null as any, [])).not.toThrow();
  });

  it('[setFormFieldsValidations]: should not throw errors if fields array is empty', () => {
    expect(() => service.setFormGroupValidations(form, [])).not.toThrow();
  });

  it('[removeFormGroupValidations]: should remove validations and set default values for specified fields', () => {
    const fields: IFormFieldInfo[] = [
      { name: 'field1', defaultValue: 'default1' },
      { name: 'field2', defaultValue: 'default2' },
    ];

    service.removeFormGroupValidations(form, fields);

    // Check if validators are removed
    expect(form.get('field1')!.validator).toBeNull();
    expect(form.get('field2')!.validator).toBeNull();

    // Check if default values are set
    expect(form.get('field1')!.value).toBe('default1');
    expect(form.get('field2')!.value).toBe('default2');
  });

  it('[removeFormGroupValidations]: should do nothing if form is null or undefined', () => {
    const fields: IFormFieldInfo[] = [{ name: 'field1', defaultValue: 'default1' }];

    service.removeFormGroupValidations(null as any, fields);

    // No assertion needed since the function should not throw
  });

  it('[removeFormGroupValidations]: should do nothing if fields array is empty or null', () => {
    service.removeFormGroupValidations(form, []);

    // Check that form state remains unchanged
    expect(form.get('field1')!.validator).not.toBeNull();
    expect(form.get('field1')!.value).toBeNull();
  });

  it('[removeFormGroupValidations]: should ignore fields that do not exist in the form group', () => {
    const fields: IFormFieldInfo[] = [{ name: 'nonexistentField', defaultValue: 'default' }];

    service.removeFormGroupValidations(form, fields);

    // Ensure the original form fields remain unchanged
    expect(form.get('field1')!.validator).not.toBeNull();
    expect(form.get('field2')!.validator).not.toBeNull();
  });

  it('[removeFormGroupValidations]: should handle fields with no defaultValue specified', () => {
    const fields: IFormFieldInfo[] = [{ name: 'field3' }];

    service.removeFormGroupValidations(form, fields);

    // Check that field3 has no validators and null value
    expect(form.get('field3')!.validator).toBeNull();
    expect(form.get('field3')!.value).toBeNull();
  });

  it('[disableFields]: should disable specified fields without options', () => {
    const fieldsToDisable: IFormFieldInfo[] = [
      { name: 'field1' },
      { name: 'field2' },
    ];

    service.disableFields(form, fieldsToDisable);

    expect(form.get('field1')!.disabled).toBeTrue();
    expect(form.get('field2')!.disabled).toBeTrue();
    expect(form.get('field3')!.disabled).toBeFalse(); // field3 should remain enabled
  });

  it('[disableFields]: should disable specified fields with options', () => {
    const fieldsToDisable: IFormFieldInfo[] = [
      { name: 'field1', options: { onlySelf: true, emitEvent: false } },
    ];

    spyOn(form.get('field1')!, 'disable').and.callThrough();

    service.disableFields(form, fieldsToDisable);

    expect(form.get('field1')!.disable).toHaveBeenCalledWith({
      onlySelf: true,
      emitEvent: false,
    });
    expect(form.get('field1')!.disabled).toBeTrue();
  });

  it('[disableFields]: should do nothing if fieldsToDisable is empty', () => {
    service.disableFields(form, []);

    // Ensure all fields remain enabled
    expect(form.get('field1')!.disabled).toBeFalse();
    expect(form.get('field2')!.disabled).toBeFalse();
    expect(form.get('field3')!.disabled).toBeFalse();
  });

  it('[disableFields]: should do nothing if a field does not exist in the form group', () => {
    const fieldsToDisable: IFormFieldInfo[] = [
      { name: 'nonexistentField' },
    ];

    service.disableFields(form, fieldsToDisable);

    // Ensure existing fields are unchanged
    expect(form.get('field1')!.disabled).toBeFalse();
    expect(form.get('field2')!.disabled).toBeFalse();
    expect(form.get('field3')!.disabled).toBeFalse();
  });

  it('[disableFields]: should gracefully handle null or undefined fieldsToDisable', () => {
    service.disableFields(form, null as any);

    // Ensure all fields remain enabled
    expect(form.get('field1')!.disabled).toBeFalse();
    expect(form.get('field2')!.disabled).toBeFalse();
    expect(form.get('field3')!.disabled).toBeFalse();
  });

  it('[disableFields]: should gracefully handle an undefined form group', () => {
    expect(() => service.disableFields(null as any, [{ name: 'field1' }])).not.toThrow();
  });

  it('[patchValuesToFields]: should patch values to specified fields', () => {
    const fieldsToSet: IFormFieldInfo[] = [
      { name: 'field1', value: 'value1' },
      { name: 'field2', value: 123 },
    ];

    service.patchValuesToFields(form, fieldsToSet);

    expect(form.get('field1')!.value).toBe('value1');
    expect(form.get('field2')!.value).toBe(123);
    expect(form.get('field3')!.value).toBeNull(); // field3 should remain unchanged
  });

  it('[patchValuesToFields]: should set field value to null if no value is provided', () => {
    const fieldsToSet: IFormFieldInfo[] = [
      { name: 'field1' },
      { name: 'field2', value: undefined },
    ];

    service.patchValuesToFields(form, fieldsToSet);

    expect(form.get('field1')!.value).toBeNull();
    expect(form.get('field2')!.value).toBeNull();
  });

  it('[patchValuesToFields]: should do nothing if fieldsToSet is empty', () => {
    service.patchValuesToFields(form, []);

    // Ensure all fields remain unchanged
    expect(form.get('field1')!.value).toBeNull();
    expect(form.get('field2')!.value).toBeNull();
    expect(form.get('field3')!.value).toBeNull();
  });

  it('[patchValuesToFields]: should do nothing for nonexistent fields', () => {
    const fieldsToSet: IFormFieldInfo[] = [{ name: 'nonexistentField', value: 'someValue' }];

    service.patchValuesToFields(form, fieldsToSet);

    // Ensure original fields remain unchanged
    expect(form.get('field1')!.value).toBeNull();
    expect(form.get('field2')!.value).toBeNull();
    expect(form.get('field3')!.value).toBeNull();
  });

  it('[patchValuesToFields]: should handle null or undefined form gracefully', () => {
    expect(() => service.patchValuesToFields(null as any, [{ name: 'field1', value: 'value1' }])).not.toThrow();
  });

  it('[patchValuesToFields]: should gracefully handle null or undefined fieldsToSet', () => {
    service.patchValuesToFields(form, null as any);

    // Ensure no changes occur
    expect(form.get('field1')!.value).toBeNull();
    expect(form.get('field2')!.value).toBeNull();
    expect(form.get('field3')!.value).toBeNull();
  });

  it('should add new controls to a typed FormGroup', () => {
    const fieldsToAdd: IFormFieldInfo[] = [
      { name: 'field3', value: 'value3', validations: [] },
      { name: 'field4', value: 123, validations: [] },
    ];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.contains('field3')).toBeTrue();
    expect(form.contains('field4')).toBeTrue();
    expect(form.get('field3')!.value).toBe('value3');
    expect(form.get('field4')!.value).toBe(123);
  });

  it('should add new controls to an UntypedFormGroup', () => {
    const fieldsToAdd: IFormFieldInfo[] = [
      { name: 'field3', value: 'value3', validations: [] },
    ];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.contains('field3')).toBeTrue();
    expect(form.get('field3')!.value).toBe('value3');
  });

  it('should remove existing controls', () => {
    const fieldsToRemove = [{ name: 'field1' }, { name: 'field2', emitEvent: true }];

    service.changeFormControlFields(form, [], fieldsToRemove);

    expect(form.contains('field1')).toBeFalse();
    expect(form.contains('field2')).toBeFalse();
  });

  it('should not add a control if it already exists', () => {
    const fieldsToAdd: IFormFieldInfo[] = [{ name: 'field1', value: 'newValue', validations: [] }];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.get('field1')!.value).toBeNull(); // Original value remains
  });

  it('should not remove a control that does not exist', () => {
    const fieldsToRemove = [{ name: 'nonexistentField' }];

    expect(() => service.changeFormControlFields(form, [], fieldsToRemove)).not.toThrow();

    expect(form.contains('field1')).toBeTrue();
    expect(form.contains('field2')).toBeTrue();
  });

  it('should handle empty arrays gracefully', () => {
    service.changeFormControlFields(form, [], []);

    expect(form.contains('field1')).toBeTrue();
    expect(form.contains('field2')).toBeTrue();
  });

  it('should handle null or undefined inputs gracefully', () => {
    expect(() => service.changeFormControlFields(form, null as any, null as any)).not.toThrow();
    expect(form.contains('field1')).toBeTrue();
    expect(form.contains('field2')).toBeTrue();
  });

  it('should use correct validators when adding controls', () => {
    const fieldsToAdd: IFormFieldInfo[] = [
      { name: 'field3', value: 'value3', validations: [Validators.required] },
    ];

    service.changeFormControlFields(form, fieldsToAdd, []);

    expect(form.contains('field3')).toBeTrue();
    expect(form.get('field3')!.validator).toBeDefined();
  });




  it('[checkIfFormControlsMatch]: should set error when controls do not match', () => {
    passwordForm.get('password')!.setValue('password123');
    passwordForm.get('confirmPassword')!.setValue('differentPassword');

    service.checkIfFormControlsMatch(form, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toEqual({ mustMatch: true });
  });

  it('[checkIfFormControlsMatch]: should not set error when controls match', () => {
    passwordForm.get('password')!.setValue('password123');
    passwordForm.get('confirmPassword')!.setValue('password123');

    service.checkIfFormControlsMatch(form, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toBeNull();
  });

  it('[checkIfFormControlsMatch]: should retain existing unrelated errors on matching control', () => {
    passwordForm.get('password')!.setValue('password123');
    passwordForm.get('confirmPassword')!.setErrors({ otherError: true });

    service.checkIfFormControlsMatch(passwordForm, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toEqual({ otherError: true });
  });

  it('[checkIfFormControlsMatch]: should handle UntypedFormGroup correctly', () => {
    passwordForm.get('password')!.setValue('password123');
    passwordForm.get('confirmPassword')!.setValue('differentPassword');

    service.checkIfFormControlsMatch(passwordForm, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toEqual({ mustMatch: true });

    passwordForm.get('confirmPassword')!.setValue('password123');
    service.checkIfFormControlsMatch(passwordForm, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toBeNull();
  });

  it('[checkIfFormControlsMatch]: should do nothing if matching control has errors other than "mustMatch"', () => {
    passwordForm.get('password')!.setValue('password123');
    passwordForm.get('confirmPassword')!.setErrors({ otherError: true });

    service.checkIfFormControlsMatch(form, 'password', 'confirmPassword');

    expect(passwordForm.get('confirmPassword')!.errors).toEqual({ otherError: true });
  });

  it('[checkIfFormControlsMatch]: should do nothing if control or matching control is missing', () => {
    const formBuilder = new FormBuilder();
    const incompleteForm = formBuilder.group({
      password: [''],
    });

    expect(() =>
      service.checkIfFormControlsMatch(incompleteForm, 'password', 'confirmPassword')
    ).not.toThrow();
  });



  it('should remove the specified control if it exists', () => {
    expect(form.contains('field1')).toBeTrue();

    service.removeFormControl(form, 'field1');

    expect(form.contains('field1')).toBeFalse();
  });

  it('should not throw an error if the control does not exist', () => {
    expect(form.contains('nonExistentField')).toBeFalse();

    expect(() => service.removeFormControl(form, 'nonExistentField')).not.toThrow();
  });

  it('should not modify the form if the control does not exist', () => {
    const initialControls = Object.keys(form.controls);

    service.removeFormControl(form, 'nonExistentField');

    expect(Object.keys(form.controls)).toEqual(initialControls);
  });

  it('should work with a form containing multiple controls', () => {
    expect(form.contains('field1')).toBeTrue();
    expect(form.contains('field2')).toBeTrue();

    service.removeFormControl(form, 'field1');

    expect(form.contains('field1')).toBeFalse();
    expect(form.contains('field2')).toBeTrue();
  });

});
