import { ISchema } from '../schemes/schema';
import { ValidationError } from './validation-error';
import { ValidatorType } from './validator-type';


export interface IValidator {
    validatorType: ValidatorType;
    Assert(dataItems: any[], schema: ISchema): ValidationError[];
}
