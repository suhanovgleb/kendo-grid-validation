
import { Injectable } from '@angular/core';
import { ISchema } from '../schemes/schema';
import { ValidationError } from '../validation';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  public validate(schema: ISchema, datasets: any): ValidationError[] {

    let errors: ValidationError[] = [];

    for (const validator of schema.getValidators()) {
      // Could be a problem if uglificators will be used
      if (validator.constructor.name === 'UniqueConstraintsValidator') {
        errors = errors.concat(validator.Assert(datasets.allItems, schema));
      } else {
        errors = errors.concat(validator.Assert(datasets.changedItems, schema));
      }
    }

    return errors;
  }
}
