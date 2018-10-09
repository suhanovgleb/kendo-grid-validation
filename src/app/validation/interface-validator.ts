
import { ValidationError } from './validation-error';
import { ISchema } from '../schemes/schema';
import { ValidatorType } from './validator-type';

export interface IValidator {
    validatorType: ValidatorType;
    Assert(dataItems: any[], schema: ISchema): ValidationError[];
}
