import { ErrorInfo } from './../validation-error';

import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';
import { ValidatorType } from '../validator-type';

export class PriceToUnitValidator implements IValidator {
    validatorType = ValidatorType.Custom;

    Assert(items: any[], schema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'priceToUnitValidator';
        const errorMessage = 'If units are out of stock then price cannot be higher than 30';
        const fieldNames = ['UnitPrice', 'UnitsInStock'];

        for (const item of items) {
            if (item.hasOwnProperty('UnitPrice') && item.hasOwnProperty('UnitsInStock')) {
                if (item.UnitPrice > 30 && item.UnitsInStock === 0) {
                    
                    const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                    errors.push(new ValidationError(errorInfo, item, fieldNames));
                    // errors.push(new ValidationError(
                    //     ['UnitPrice', 'UnitsInStock'],
                    //     item,
                    //     'price_to_units',
                    //     ,
                    // ));
                }
            }
        }

        return errors;
    }
}
