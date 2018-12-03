
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

  public removePairedErrors(validationErrors: ValidationError[], dataItem: any, idField: string) {
    for (const error of validationErrors) {

      const hashTable = {};



      if (error.item[idField] === dataItem[idField]) {
        for (const field in dataItem) {
          if (dataItem.hasOwnProperty(field)) {
            // check if cell was changed then delete error
            if ((dataItem[field] !== error.item[field]) && (error.fieldNames.includes(field))) {
              if (error.errorInfo.errorType === ValidatorType.UniqueConstraint) {
                const sameConstraintErrors = validationErrors.filter((e) => {
                  if (e.errorInfo.errorType === ValidatorType.UniqueConstraint) {
                    return e;
                  }
                });
                if (sameConstraintErrors.length === 2) {
                  for (const err of sameConstraintErrors) {
                    const idx = validationErrors.indexOf(error);
                    validationErrors.splice(idx, 1);
                  }
                } else {
                  const index = validationErrors.indexOf(error);
                  validationErrors.splice(index, 1);
                }
              } else {
                const index = validationErrors.indexOf(error);
                validationErrors.splice(index, 1);
              }
            }
          }
        }
      }
    }
  }
}
