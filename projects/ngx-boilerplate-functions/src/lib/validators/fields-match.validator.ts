import {FormGroup, ValidatorFn} from '@angular/forms';

export function fieldsMatch(firstControlName: string, secondControlName: string): ValidatorFn {
  return control => {
    if (!(control instanceof FormGroup)) return null;
    const first = control.get(firstControlName);
    const second = control.get(secondControlName);
    if (!first || !second) return null;
    return first.value === second.value
      ? null
      : {fieldsMismatch: {first: firstControlName, second: secondControlName}};
  };
}
