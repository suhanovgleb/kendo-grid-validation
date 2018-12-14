import { ErrorInfo } from './../validation-error';

import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';
import { ValidatorType } from '../validator-type';


export class MaxValidator implements IValidator {
    validatorType = ValidatorType.Simple;

    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'max';
        let errorMessage = '';
        
        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('max')) {
                    const maxValue = field.validators.max;
                    if (item[field.name] > maxValue) {
                        errorMessage = field.name + ' can\'t be higher than ' + maxValue + '.';
                        const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                        errors.push(new ValidationError(errorInfo, item, [field.name]));
                    }
                }
            }
        }

        return errors;
    }
}
