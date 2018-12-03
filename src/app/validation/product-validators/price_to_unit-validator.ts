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
        const fieldNames = ['Price', 'Quantity'];

        for (const item of items) {
            if (item.hasOwnProperty('Price') && item.hasOwnProperty('Quantity')) {
                if (item.Price > 30 && item.Quantity === 0) {
                    const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                    errors.push(new ValidationError(errorInfo, item, fieldNames));
                }
            }
        }

        return errors;
    }
}
