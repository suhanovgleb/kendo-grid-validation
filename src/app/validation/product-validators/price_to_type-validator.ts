import { ErrorInfo } from './../validation-error';

import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';
import { ValidatorType } from '../validator-type';

export class PriceToTypeValidator implements IValidator {
    validatorType = ValidatorType.Custom;

    Assert(items: any[], schema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'priceToTypeValidator';
        const errorMessage = 'Price must be 100 or more times greater than the type number.';
        const fieldNames = ['Price', 'ProductType.Name'];

        for (const item of items) {
            if (item.hasOwnProperty('Price') && item.hasOwnProperty('ProductType')) {
                if (item.Price < item.ProductType.Id * 100) {
                    const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                    errors.push(new ValidationError(errorInfo, item, fieldNames));
                }
            }
        }

        return errors;
    }
}
