import { Injectable } from '@angular/core';

import { EditService } from './edit.service';
import { ProductSchema } from '../schema';

@Injectable({
  providedIn: 'root'
})

export class ValidationService {

  constructor(private editService: EditService) { }

  public validate(schema: ProductSchema): ValidationError[] {
    const changedItems = this.editService.updatedItems
      .concat(this.editService.createdItems);

    const errors: ValidationError[] = [];

    for (const item of changedItems) {
      for (const field of schema.fields) {
        // Check if we have any validators in schema field
        if ( !(Object.keys(field.validatiors).length === 0 && field.validatiors.constructor === Object) ) {

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
    return errors;
  }
}

class ValidationError {
  constructor(fieldName, item, errType, errMessage) {
    this.fieldName = fieldName;
    this.item = item;
    this.errType = errType;
    this.errMessage = errMessage;
  }
  
  public fieldName: string;
  public item;
  public errType: string;
  public errMessage: string;
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
