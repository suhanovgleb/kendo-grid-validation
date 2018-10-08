
import { ISchema } from '../../schemes/schema';
import { ValidationError, ErrorInfo } from '../validation-error';
import { IValidator } from '../interface-validator';
import { ValidatorType } from '../validator-type';


export class MinValidator implements IValidator {
    validatorType = ValidatorType.Simple;

    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'min';
        let errorMessage = '';

        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('min')) {
                    const minValue = field.validators.min;
                    if (item[field.name] < minValue) {
                        errorMessage = field.name + ' can\'t be less than ' + minValue + '.';
                        const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                        errors.push(new ValidationError(errorInfo, item, field.name));
                        // errors.push(new ValidationError(
                        //     [field.name],
                        //     item,
                        //     'min',
                        //     field.name + ' can\'t be less than ' + minValue + '.')
                        // );
                    }
                }
            }
        }

        return errors;
    }
}
