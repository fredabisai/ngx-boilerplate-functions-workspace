import { TestBed } from '@angular/core/testing';

import { FormsFunctionsService } from './forms-functions.service';
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {FormFieldInfo} from "../interfaces/ngx-boilerplate-functions.interface";

describe('FormsFunctionsService', () => {
  let service: FormsFunctionsService;
  let form: FormGroup;

  let validationForm: FormGroup;

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('[setFormFieldsValidations]: should set validators on specified form fields', () => {
    const fields: FormFieldInfo[] = [
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
    const fields: FormFieldInfo[] = [
      { name: 'nonExistentField', validations: [Validators.required] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.contains('nonExistentField')).toBeFalse();
  });

  it('[setFormFieldsValidations]: should skip fields with empty or undefined validations array', () => {
    const fields: FormFieldInfo[] = [
      { name: 'name', validations: [] }
    ];

    service.setFormGroupValidations(form, fields);

    expect(form.get('name')!.validator).toBeNull();
  });

  it('[setFormFieldsValidations]: should update value and validity after setting validators', () => {
    const fields: FormFieldInfo[] = [
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
    const fields: FormFieldInfo[] = [
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
    const fields: FormFieldInfo[] = [{ name: 'field1', defaultValue: 'default1' }];

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
    const fields: FormFieldInfo[] = [{ name: 'nonexistentField', defaultValue: 'default' }];

    service.removeFormGroupValidations(form, fields);

    // Ensure the original form fields remain unchanged
    expect(form.get('field1')!.validator).not.toBeNull();
    expect(form.get('field2')!.validator).not.toBeNull();
  });

  it('[removeFormGroupValidations]: should handle fields with no defaultValue specified', () => {
    const fields: FormFieldInfo[] = [{ name: 'field3' }];

    service.removeFormGroupValidations(form, fields);

    // Check that field3 has no validators and null value
    expect(form.get('field3')!.validator).toBeNull();
    expect(form.get('field3')!.value).toBeNull();
  });
});
