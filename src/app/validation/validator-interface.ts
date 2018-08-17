import { ValidationError } from './validation-error';
import { Schema } from '../schemes/schema';

export interface IValidator {
    Assert(gridRowItem: any, schema?: Schema, changedItems?: any[]): ValidationError[];
}
