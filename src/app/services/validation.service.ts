import { Injectable } from '@angular/core';

import { EditService } from './edit.service';
import { Schema } from '../schema';
import { ValidationError } from '../ValidationError';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {

  constructor(private editService: EditService) { }

  public getNameHash(item, uniqueConstraints): string {
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

  public validate(schema: Schema): ValidationError[] {

    const errors: ValidationError[] = [];

    const changedItems = this.editService.updatedItems
      .concat(this.editService.createdItems);

    // in this cycle are processing basic validators: required, max, min
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

    // here we starting processing unique contstraints
    const allItems = this.editService.data;
    const hashTable: object = {};

    // fill hashtable with keys-constraints and count number of matches
    for (const item of allItems) {
      if (!hashTable.hasOwnProperty(this.getNameHash(item, schema.uniqueConstraints))) {
        hashTable[this.getNameHash(item, schema.uniqueConstraints)] = 1;
      } else {
        hashTable[this.getNameHash(item, schema.uniqueConstraints)]++;
      }
    }

    // here we delete all non-repeating items from hashtable
    for (const key in hashTable) {
      if (hashTable[key] === 1) {
        delete hashTable[key];
      }
    }

    
    for (const item of allItems) {
      const hashName = this.getNameHash(item, schema.uniqueConstraints);
      if (hashTable.hasOwnProperty(hashName) && hashTable[hashName] !== 0) {
        const errMessageConstraints = schema.uniqueConstraints.join(', ');
        errors.push(
          new ValidationError(
            null, 
            item, 
            'unique', 
            'This entry must be unique in the following fields: ' + errMessageConstraints + '.', 
            schema.uniqueConstraints)
        );
        hashTable[hashName]--;
      }
    }

    return errors;
  }
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
