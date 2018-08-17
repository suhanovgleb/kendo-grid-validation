
import { ValidationError } from './validation-error';
import { Schema } from '../schemes/schema';
import { IValidator } from './validator-interface';

export class BaseValidator implements IValidator {
    Assert(gridRowItem: any, schema?: Schema): ValidationError[] {
        const errors: ValidationError[] = [];
        if (gridRowItem.UnitPrice > 30 && gridRowItem.UnitsInStock === 0) {
            errors.push( new ValidationError(
                        null, 
                        gridRowItem, 
                        'price_to_units', 
                        'If units are out of stock then price cannot be higher than 30', 
                        ['UnitPrice', 'UnitsInStock']
                    ));
        }   
        return errors;
    }
}

class Cell {
    constructor(public name, public  value) {}
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
