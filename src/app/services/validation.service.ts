import { Injectable } from '@angular/core';

import { EditService } from './edit.service';
import { ProductSchema } from '../schema';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {

  constructor(private editService: EditService) { }

  public getHashName(item, uniqueConstraints): string {
    let name = '';
    for (const constraint of uniqueConstraints) {
      if (uniqueConstraints[0] === constraint) {
        name = name.concat(item[constraint]);
      } else {
        name = name.concat(':', item[constraint]);
      }
    }
    return name;
  }

  public getHashNames(data, uniqueConstraints: string[]) {

    const hashNames: string[] = [];

    for (const item of data) {
      let name = '';
      for (const constraint of uniqueConstraints) {
        if (uniqueConstraints[0] === constraint) {
          name = name.concat(item[constraint]);
        } else {
          name = name.concat(':', item[constraint]);
        }
      }

      hashNames.push(name);
    }
    return hashNames;
  }

  public validate(schema: ProductSchema): ValidationError[] {
    const changedItems = this.editService.updatedItems
      .concat(this.editService.createdItems);

    const allItems = this.editService.data;

    const errors: ValidationError[] = [];

    for (const item of changedItems) {
      for (const field of schema.fields) {
        // Check if we have any validators in schema field
        if (!(Object.keys(field.validatiors).length === 0 && field.validatiors.constructor === Object)) {

          const cell = new Cell(field.name, item[field.name]);

          if (field.validatiors.hasOwnProperty('required')) {
            const validationResult = Validators.required(item, cell, field.validatiors.required);
            if (validationResult !== null) {
              errors.push(validationResult);
            }
          }

          if (cell.value !== null && cell.value !== undefined && cell.value !== '') {

            if (field.validatiors.hasOwnProperty('max')) {
              const validationResult = Validators.max(item, cell, field.validatiors.max);
              if (validationResult !== null) {
                errors.push(validationResult);
              }
            }

            if (field.validatiors.hasOwnProperty('min')) {
              const validationResult = Validators.min(item, cell, field.validatiors.min);
              if (validationResult !== null) {
                errors.push(validationResult);
              }
            }

          }
        }
      }
    }

    const constraintHashTable: ConstraintHash[] = [];
    const hashNames: string[];

    for (const item of allItems) {
      hashNames.push(this.getHashName(item, schema.uniqueConstraints));
    }
    
    for (const name of hashNames) {
      if (constraintHashTable.includes(ConstraintHash(name, 23))) {
        constraintHash.matches++;
        isAdded = true;
      }
    }
    if (!isAdded) {
      constraintHashTable.push(new ConstraintHash(name, 1));
    }


    // const constraintHashTable: ConstraintHash[] = [];
    // const hashNames: string[];
    // for (const item of allItems) {
    //   hashNames
    // }
    // const hashNames = this.getHashNames(allItems, schema.uniqueConstraints);
    // for (const name of hashNames) {
    //   let isAdded = false;
    //   for (const constraintHash of constraintHashTable) { 
    //     if (constraintHash.name === name) {
    //       constraintHash.matches++;
    //       isAdded = true;
    //     }
    //   }
    //   if (!isAdded) {
    //     constraintHashTable.push(new ConstraintHash(name, 1));
    //   }
    // }




    return errors;
  }
}

class ConstraintHash {

  constructor(name: string, matches: number) {
    this.name = name;
    this.matches = matches;
  }

  name: string;
  matches: number;
}

class ValidationError {
  constructor(fieldName: string, item, errType: string, errMessage: string, uniqueFieldNames?: string[]) {
    this.fieldName = fieldName;
    this.item = item;
    this.errType = errType;
    this.errMessage = errMessage;
    this.uniqueFieldNames = uniqueFieldNames;
  }

  public fieldName: string;
  public item;
  public errType: string;
  public errMessage: string;
  public uniqueFieldNames: string[];
}

class Cell {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  public name: string;
  public value: any;
}

module Validators {

  export function required(item: any, cell: Cell, state: boolean): ValidationError {
    if (state === false) { return null; }
    if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
      return null;
    } else {
      const errMessage = 'This cell cannot be empty.';
      return new ValidationError(cell.name, item, 'required', errMessage);
    }
  }

  export function max(item: any, cell: Cell, maxValue: number): ValidationError {
    if (cell.value <= maxValue) {
      return null;
    }
    const errMessage = 'This value must be less than or equal to ' + maxValue + '.';
    return new ValidationError(cell.name, item, 'max', errMessage);
  }

  export function min(item: any, cell: Cell, minValue: number): ValidationError {
    if (cell.value >= minValue) {
      return null;
    }
    const errMessage = 'This value must be greater than or equal to ' + minValue + '.';
    return new ValidationError(cell.name, item, 'min', errMessage);
  }

}


    // for (const hash of constraintHashTable) {
    //   if (hash.matches > 1) {
    //     console.log(hash);
    //   }
    // }


      // let xx = [
      //   {name:"Chai:true", matches: ++},
      //   {name:"Ani", matches: 1},
      //   {name:"nsdf:true", matches: 1},
      // ]

      // form key, compoare with key above


    // for (let compareItem = 0; compareItem < allItems.length; compareItem++) {
    //   let isUnique = true;
    //   for (let item = compareItem + 1; item < allItems.length; item++) {
    //     let constraintCounter = 0;
    //     for (const constraint of schema.uniqueConstraints) {
    //       if (allItems[item][constraint] === allItems[compareItem][constraint]) {
    //         constraintCounter++;
    //       }
    //     }
    //     if (constraintCounter === schema.uniqueConstraints.length) {
    //       errors.push(new ValidationError(null, item, 'uniqueConstraint', 'Not unique', schema.uniqueConstraints));
    //       isUnique = false;
    //     }
    //   }
    //   if (!isUnique) {
    //     errors.push(new ValidationError(null, compareItem, 'uniqueConstraint', 'Not unique', schema.uniqueConstraints));
    //   }
    // }