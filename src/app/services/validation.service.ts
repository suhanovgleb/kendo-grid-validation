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

  private getErrorHash(error: ValidationError): string {
    let name = error.errorInfo.errorName;
    const fieldNames = error.fieldNames;
    for (const fieldName of fieldNames) {
        name = name.concat(':', error.item[fieldName]);
    }
    return name;
  }

  public removePairedErrors(validationErrors: ValidationError[], dataItem: any, idField: string): void {
    let hashTable = {};
    const uniqueConstraintErrors: ValidationError[] = [];

    // fill hashtable with keys-constraints and count number of matches
    for (const error of validationErrors) {
      if (error.errorInfo.errorType === ValidatorType.UniqueConstraint) {
        const errorHash = this.getErrorHash(error);
        if (!hashTable.hasOwnProperty(errorHash)) {
          hashTable[errorHash] = 1;
          uniqueConstraintErrors.push(error);
        } else {
          hashTable[errorHash]++;
        }
      }
      
    }

    // here we delete all non-paired errors or errors with more than 2 matches (leave only hash = 2)
    const tempHashTable: any = {};

    for (const key in hashTable) {
      if (hashTable.hasOwnProperty(key)) {
        if (hashTable[key] === 2) {
          tempHashTable[key] = hashTable[key];
        }
      }
    }

    hashTable = tempHashTable;

    for (const hash in hashTable) {
      if (hashTable.hasOwnProperty(hash)) {
        for (const error of uniqueConstraintErrors) {
          if (this.getErrorHash(error) === hash) {
            hashTable[hash]--;
            const idx = validationErrors.indexOf(error);
            validationErrors.splice(idx, 1);
          }
        }
      }
    }

    // const hashTableLength = Object.keys(hashTable).length;
    // for (let i = 0; i >= hashTableLength; i++) {
    //   hashTable[i] =
    // }

    // for (const hash in hashTable) {
    //   if (hashTable.hasOwnProperty(hash)) {
    //     for (const error of uniqueConstraintErrors) {
          
    //     }
    //   }
    // }

    // for (const error of uniqueConstraintErrors) {
    //   if (error.item[idField] === dataItem[idField]) {
    //     for (const field in dataItem) {
    //       if (dataItem.hasOwnProperty(field)) {
    //         if ((dataItem[field] !== error.item[field]) && (error.fieldNames.includes(field))) {
    //           if (hashTable.hasOwnProperty(this.getErrorHash(error))) {
    //             const idx = validationErrors.indexOf(error);
    //             validationErrors.splice(idx, 1);
    //           }
    //         }
    //       }
    //     }
    //   }
      
      
    // }
    
  }
}


// if (error.item[idField] === dataItem[idField]) {
//   for (const field in dataItem) {
//     if (dataItem.hasOwnProperty(field)) {
//       // check if cell was changed then delete error
//       if ((dataItem[field] !== error.item[field]) && (error.fieldNames.includes(field))) {
//         if (error.errorInfo.errorType === ValidatorType.UniqueConstraint) {
//           const sameConstraintErrors = validationErrors.filter((e) => {
//             if (e.errorInfo.errorType === ValidatorType.UniqueConstraint) {
//               return e;
//             }
//           });
//           if (sameConstraintErrors.length === 2) {
//             for (const err of sameConstraintErrors) {
//               const idx = validationErrors.indexOf(error);
//               validationErrors.splice(idx, 1);
//             }
//           } else {
//             const index = validationErrors.indexOf(error);
//             validationErrors.splice(index, 1);
//           }
//         } else {
//           const index = validationErrors.indexOf(error);
//           validationErrors.splice(index, 1);
//         }
//       }
//     }
//   }
// }