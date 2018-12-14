import { inject } from '@angular/core/testing';

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

  public removePairedErrors(validationErrors: ValidationError[], dataItem: any, idField: string): void {
    const errorOfDataItem = validationErrors.find((error) => {
      if (dataItem[idField] === error.item[idField] && error.errorInfo.errorType === ValidatorType.UniqueConstraint) {
        let hasChanges = false; 
        for (const field of error.fieldNames) {
          if (dataItem.hasOwnProperty(field)) {
            if (dataItem[field] !== error.item[field]) {
              hasChanges = true;
              break;
            }
          }
        }
        if (hasChanges) {
          return true;
        }
      }
    });

    if (errorOfDataItem !== undefined) {
      const sameErrors: ValidationError[] = [];
      for (const error of validationErrors) {
        if (error.errorInfo.errorType === errorOfDataItem.errorInfo.errorType) {
          if (errorOfDataItem.fieldNames === error.fieldNames) {
            let isDifferent = false;
            for (const field of error.fieldNames) {
              if (errorOfDataItem.item[field] !== error.item[field]) {
                isDifferent = true;
              }
            }
            if (!isDifferent) {
              sameErrors.push(error);
            }
          }
        }
      }
      if (sameErrors.length === 2) {
        for (const error of sameErrors) {
          const idx = validationErrors.indexOf(error);
          validationErrors.splice(idx, 1);
        }
      }
    }

  }

  public removeErrorsFromChangedItems(validationErrors: ValidationError[], dataItem: any, idField: string) {
    for (const error of validationErrors) {
      if (error.item[idField] === dataItem[idField]) {
        for (const field in dataItem) {
          if (dataItem.hasOwnProperty(field)) {
            if ((dataItem[field] !== error.item[field]) && (error.fieldNames.includes(field))) {
              const idx = validationErrors.indexOf(error);
              validationErrors.splice(idx, 1);
            }
          }
        }
      }
    }
  }

}
