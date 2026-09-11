import {formatDate as angularFormatDate} from '@angular/common';

export type Payload = Record<string, unknown>;

export class PackageUtils {
  private constructor() {}

  static hasOwn(obj: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  static removeKeyFromObject(obj: Payload, key: string): Payload {
    if (!this.hasOwn(obj, key)) return obj;
    const {[key]: _removed, ...result} = obj;
    return result;
  }

  static convertToString(obj: Payload, name: string): Payload {
    if (!this.hasOwn(obj, name)) return obj;
    const value = obj[name];
    return {
      ...obj,
      [name]: typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value),
    };
  }

  static formatDate(
    obj: Payload,
    name: string,
    format: string,
    locale = 'en-US',
  ): Payload {
    if (!this.hasOwn(obj, name)) return obj;
    const value = obj[name];
    if (!(typeof value === 'string' || typeof value === 'number' || value instanceof Date)) {
      throw new TypeError(`Field "${name}" is not a valid date input.`);
    }
    return {...obj, [name]: angularFormatDate(value, format, locale)};
  }

  static convertToNumber(obj: Payload, name: string): Payload {
    return this.convertNumericValue(obj, name, false);
  }

  static convertToFloat(obj: Payload, name: string): Payload {
    return this.convertNumericValue(obj, name, true);
  }

  static convertToBoolean(obj: Payload, name: string): Payload {
    if (!this.hasOwn(obj, name)) return obj;
    const value = obj[name];
    if (typeof value === 'boolean') return obj;
    if (value === 1 || value === '1' || value === 'true') return {...obj, [name]: true};
    if (value === 0 || value === '0' || value === 'false' || value === '' || value === null) {
      return {...obj, [name]: false};
    }
    throw new TypeError(`Field "${name}" cannot be converted to boolean.`);
  }

  static addFieldToObject(obj: Payload, name: string, value: unknown): Payload {
    return {...obj, [name]: value};
  }

  private static convertNumericValue(obj: Payload, name: string, allowDecimal: boolean): Payload {
    if (!this.hasOwn(obj, name)) return obj;
    const value = obj[name];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return allowDecimal || Number.isInteger(value) ? obj : {...obj, [name]: Math.trunc(value)};
    }
    if (typeof value !== 'string') {
      throw new TypeError(`Field "${name}" cannot be converted to a number.`);
    }
    const normalized = value.trim();
    const pattern = allowDecimal ? /^[+-]?(?:\d+\.?\d*|\.\d+)$/ : /^[+-]?\d+$/;
    if (!pattern.test(normalized)) {
      throw new TypeError(`Field "${name}" cannot be converted to a number.`);
    }
    return {...obj, [name]: Number(normalized)};
  }
}
