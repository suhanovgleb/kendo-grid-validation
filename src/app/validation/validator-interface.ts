import { ValidationError } from './validation-error';
import { ISchema } from '../schemes/schema';

export interface IValidator {
    // Assert(schema: ISchema, changedItems: any[]): ValidationError[];
    getName(): string;
    
    Assert(data: any, schema?: ISchema): ValidationError[];
}
