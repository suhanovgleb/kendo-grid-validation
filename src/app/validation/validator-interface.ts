import { ValidationError } from './validation-error';
import { ISchema } from '../schemes/schema';

export interface IValidator {
    Assert(schema: ISchema, changedItems: any[]): ValidationError[];
}
