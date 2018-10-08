
import { Injectable } from '@angular/core';
import { ISchema } from '../schemes/schema';
import { ValidationError } from '../validation';
import { ValidatorType } from '../validation/validator-type';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  public validate(schema: ISchema, datasets: any): ValidationError[] {

    let errors: ValidationError[] = [];
    const validators = schema.getServiceValidators();

    for (const validator of validators) {
      if (validator.validatorType === ValidatorType.UniqueConstraint) {
        errors = errors.concat(validator.Assert(datasets.allItems, schema));
      } else {
        errors = errors.concat(validator.Assert(datasets.changedItems, schema));
      }
    }

    return errors;
  }
}
