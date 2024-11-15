import {ValidatorFn} from "@angular/forms";

export interface IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
  formatType?: 'string' | 'number' | 'float' | 'boolean' | 'date' | 'datetime';
  dateFormat?: string;
  mappedKey: string;
}
export class FormFieldInfo implements IFormFieldInfo {
  name: string;
  validations?: ValidatorFn[];
  defaultValue?: any;
  value?: any;
  options?: { onlySelf?: boolean; emitEvent?: boolean;};
  formatType?: 'string' | 'number' | 'float' | 'boolean' | 'date' |  'remove';
  dateFormat?: string;
  mappedKey: string;
}
