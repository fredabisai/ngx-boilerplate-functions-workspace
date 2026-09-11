import {FormControl, FormGroup, UntypedFormGroup, Validators} from '@angular/forms';
import {fieldsMatch} from '../validators/fields-match.validator';
import {FormsFunctionsService} from './forms-functions.service';

describe('FormsFunctionsService', () => {
  let service: FormsFunctionsService;
  let form: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    age: FormControl<number>;
  }>;

  beforeEach(() => {
    service = new FormsFunctionsService();
    form = new FormGroup({
      name: new FormControl('', {nonNullable: true}),
      email: new FormControl('', {nonNullable: true}),
      age: new FormControl(0, {nonNullable: true}),
    });
  });

  it('sets and removes validators', () => {
    service.setFormGroupValidations(form, [
      {name: 'name', validations: [Validators.required]},
    ]);
    expect(form.controls.name.hasValidator(Validators.required)).toBe(true);

    service.removeFormGroupValidations(form, [{name: 'name', defaultValue: 'Jane'}]);
    expect(form.controls.name.validator).toBeNull();
    expect(form.controls.name.value).toBe('Jane');
  });

  it('can preserve selected manual errors while removing validator errors', () => {
    form.controls.name.setErrors({server: true});
    service.removeFormGroupValidations(form, [{name: 'name', preserveErrors: ['server']}]);
    expect(form.controls.name.errors).toEqual({server: true});

    service.removeFormGroupValidations(form, [{name: 'name'}]);
    expect(form.controls.name.errors).toBeNull();
  });

  it('disables and patches named controls', () => {
    service.disableFields(form, [{name: 'email', options: {emitEvent: false}}]);
    service.patchValuesToFields(form, [{name: 'name', value: 'John'}]);
    expect(form.controls.email.disabled).toBe(true);
    expect(form.controls.name.value).toBe('John');
  });

  it('enforces control names and value types at compile time', () => {
    if (false) {
      // @ts-expect-error age is a number control
      service.patchValuesToFields(form, [{name: 'age', value: 'thirty'}]);
      // @ts-expect-error unknown is not a control in this form
      service.disableFields(form, [{name: 'unknown'}]);
    }
    expect(true).toBe(true);
  });

  it('creates a submission payload without mutating the form', () => {
    form.setValue({name: 'John', email: 'john@example.com', age: 30});
    const result = service.addAndRemoveFieldsOnSubmission(
      form,
      [{name: 'active', value: true}],
      ['email'],
    );
    expect(result).toEqual({name: 'John', age: 30, active: true});
    expect(form.getRawValue().email).toBe('john@example.com');
  });

  it('checks actual control state marks', () => {
    expect(service.hasControlMarks(form.controls.name, ['pristine', 'untouched', 'valid'])).toBe(true);
    expect(service.hasControlMarks(form.controls.name, ['dirty'])).toBe(false);
    expect(service.hasControlMarks(form.controls.name, [])).toBe(false);
    form.controls.name.markAsTouched();
    expect(service.hasControlMarks(form.controls.name, ['touched', 'valid'])).toBe(true);
  });

  it('preserves unrelated errors in the immediate matching helper', () => {
    form.controls.name.setValue('first');
    form.controls.email.setValue('second');
    form.controls.email.setErrors({server: true});
    service.checkIfFormControlsMatch(form, 'name', 'email');
    expect(form.controls.email.errors).toEqual({server: true, mustMatch: true});

    form.controls.email.setValue('first');
    form.controls.email.setErrors({server: true, mustMatch: true});
    service.checkIfFormControlsMatch(form, 'name', 'email');
    expect(form.controls.email.errors).toEqual({server: true});
  });

  it('creates and modifies explicitly untyped dynamic forms', () => {
    const dynamic = service.initializeFormGroup([
      {name: 'username', value: 'john', validations: [Validators.required]},
    ]);
    expect(dynamic).toBeInstanceOf(UntypedFormGroup);
    expect(dynamic.get('username')?.value).toBe('john');

    service.changeFormControlFields(
      dynamic,
      [{name: 'age', value: 30}],
      [{name: 'username', emitEvent: false}],
    );
    expect(dynamic.contains('username')).toBe(false);
    expect(dynamic.get('age')?.value).toBe(30);
  });

  it('resets specified defaults and uses non-nullable defaults for other controls', () => {
    form.setValue({name: 'Changed', email: 'changed@example.com', age: 42});
    service.resetFormGroup(form, [{name: 'name', value: 'Default'}]);
    expect(form.getRawValue()).toEqual({name: 'Default', email: '', age: 0});
  });

  it('gets errors and reports group validity', () => {
    form.controls.name.setErrors({required: true});
    expect(service.getFormControlError(form.controls.name, 'required')).toBe(true);
    expect(service.getFormGroupErrorMessages(form)).toEqual({name: {required: true}});
    expect(service.isFormGroupValid(form)).toBe(false);
  });

  it('formats payload values safely', () => {
    form.setValue({name: 'false', email: '2025-01-02', age: 12});
    const payload = service.formatPayloadForSubmission(form, [
      {name: 'name', formatType: 'boolean'},
      {name: 'email', formatType: 'date', dateFormat: 'yyyy-MM-dd', locale: 'en-US'},
      {name: 'age', formatType: 'string'},
      {name: 'extra', formatType: 'add', value: 'added'},
    ]);
    expect(payload).toEqual({name: false, email: '2025-01-02', age: '12', extra: 'added'});
  });

  it('rejects partial numeric values and ambiguous booleans', () => {
    form.controls.name.setValue('12abc');
    expect(() => service.formatPayloadForSubmission(form, [
      {name: 'name', formatType: 'number'},
    ])).toThrow(TypeError);

    form.controls.name.setValue('yes');
    expect(() => service.formatPayloadForSubmission(form, [
      {name: 'name', formatType: 'boolean'},
    ])).toThrow(TypeError);
  });

  it('patches direct and mapped values', () => {
    service.patchFormGroupValues(form, {name: 'Alice', email: 'a@example.com', age: 31});
    expect(form.controls.name.value).toBe('Alice');

    service.patchFormGroupValues(
      form,
      {name: 'ignored', email: 'mapped@example.com'},
      [{name: 'name', mappedKey: 'email'}],
    );
    expect(form.controls.name.value).toBe('mapped@example.com');
  });

  it('marks nested controls as touched', () => {
    const nested = new FormGroup({child: new FormGroup({value: new FormControl('')})});
    service.markAllControlsAsTouched(nested);
    expect(nested.controls.child.controls.value.touched).toBe(true);
  });
});

describe('fieldsMatch', () => {
  it('returns a group validation error only when values differ', () => {
    const form = new FormGroup(
      {password: new FormControl('one'), confirmation: new FormControl('two')},
      {validators: fieldsMatch('password', 'confirmation')},
    );
    expect(form.errors).toEqual({
      fieldsMismatch: {first: 'password', second: 'confirmation'},
    });
    form.controls.confirmation.setValue('one');
    expect(form.errors).toBeNull();
  });
});
