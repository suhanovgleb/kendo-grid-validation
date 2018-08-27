
import { ValidationError } from './validation-error';
import { ISchema } from '../schemes/schema';

export interface IValidator {
    Assert(dataItems: any[], schema: ISchema): ValidationError[];
}
