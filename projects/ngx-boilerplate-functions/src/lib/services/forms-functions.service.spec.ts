import { TestBed } from '@angular/core/testing';

import { FormsFunctionsService } from './forms-functions.service';
import {FormBuilder, FormGroup, UntypedFormGroup, Validators} from "@angular/forms";
import {FormFieldInfo} from "../interfaces/ngx-boilerplate-functions.interface";

describe('FormsFunctionsService', () => {
  let service: FormsFunctionsService;
  let form: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsFunctionsService);
    form = new FormBuilder().group({
      name: [''],
      email: [''],
      age: ['']
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
});
