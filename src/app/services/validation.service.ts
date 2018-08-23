import { Injectable } from '@angular/core';
import { EditService } from './edit.service';
import { ISchema } from '../schemes/schema';
import { BaseValidator, ValidationError, UniqueConstraintsValidator, IValidator } from '../validation';
import { share } from 'rxjs/operators';
import { RequiredValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private editService: EditService) { }

  //#region getNameHash
  // private getNameHash(item, uniqueConstraints): string {
  //   let name = '';
  //   for (const constraint of uniqueConstraints) {
  //     if (uniqueConstraints[0] === constraint) {
  //       name = name.concat(item[constraint]);
  //     } else {
  //       name = name.concat(':', item[constraint]);
  //     }
  //   }
  //   return name;
  // }
  //#endregion

  public validate(schema: ISchema): ValidationError[] {

    let errors: ValidationError[] = [];

    const changedItems = this.editService
                             .updatedItems
                             .concat(this.editService.createdItems);

    const validators: IValidator[] = this.GetAllValidators(schema);

    

    for (const validator of validators) {
      const validationErrors = validator.Assert(changedItems, schema);
      errors = errors.concat(errors, validationErrors);
    }
    
    return errors;

    //#region "commented code, can be useful"
    // // for (const item of changedItems) {
    // //   for (const valid of validators) {
    // //     const validationErrors = valid.Assert(item, schema, changedItems);
    // //     errors = concat(errors, validationErrors);
    // //   }
    // // }

      // // in this cycle are processing basic validators: required, max, min
    // for (const item of changedItems) {
    //   for (const field of schema.fields) {
    //     // Check if we have any validators in schema field
    //     if (!(Object.keys(field.validatiors).length === 0 && field.validatiors.constructor === Object)) {

    //       const cell = new Cell(field.name, item[field.name]);

    //       if (field.validatiors.hasOwnProperty('required')) {
    //         const validationResult = Validators.required(item, cell, field.validatiors.required);
    //         if (validationResult !== null) {
    //           errors.push(validationResult);
    //         }
    //       }

    //       if (cell.value !== null && cell.value !== undefined && cell.value !== '') {

    //         if (field.validatiors.hasOwnProperty('max')) {
    //           const validationResult = Validators.max(item, cell, field.validatiors.max);
    //           if (validationResult !== null) {
    //             errors.push(validationResult);
    //           }
    //         }

    //         if (field.validatiors.hasOwnProperty('min')) {
    //           const validationResult = Validators.min(item, cell, field.validatiors.min);
    //           if (validationResult !== null) {
    //             errors.push(validationResult);
    //           }
    //         }

    //       }
    //     }
    //   }
    // }

    // // here we starting processing unique contstraints
    // const allItems = this.editService.data;
    // const hashTable: object = {};

    // // fill hashtable with keys-constraints and count number of matches
    // for (const item of allItems) {
    //   if (!hashTable.hasOwnProperty(this.getNameHash(item, schema.uniqueConstraints))) {
    //     hashTable[this.getNameHash(item, schema.uniqueConstraints)] = 1;
    //   } else {
    //     hashTable[this.getNameHash(item, schema.uniqueConstraints)]++;
    //   }
    // }

    // // here we delete all non-repeating items from hashtable
    // for (const key in hashTable) {
    //   if (hashTable[key] === 1) {
    //     delete hashTable[key];
    //   }
    // }

    
    // for (const item of allItems) {
    //   const hashName = this.getNameHash(item, schema.uniqueConstraints);
    //   if (hashTable.hasOwnProperty(hashName) && hashTable[hashName] !== 0) {
    //     const errMessageConstraints = schema.uniqueConstraints.join(', ');
    //     errors.push(
    //       new ValidationError(
    //         null, 
    //         item, 
    //         'unique', 
    //         'This entry must be unique in the following fields: ' + errMessageConstraints + '.', 
    //         schema.uniqueConstraints)
    //     );
    //     hashTable[hashName]--;
    //   }
    // }

    // return errors;
    //#endregion
  }

  public GetAllValidators(schema: ISchema): IValidator[] {
    for (const field of schema.fields) {
      const validators = field.validators;
      if (validators.hasOwnProperty('required')) {
        if (validators.required === true) {
          
        }
      }
    }
    
    return <IValidator[]>[new BaseValidator(), new UniqueConstraintsValidator(), new RequiredValidator()];
  }
}
