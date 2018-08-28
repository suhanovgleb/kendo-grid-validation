
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';

export class PriceToUnitValidator implements IValidator {

    Assert(items: any[], schema): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const item of items) {
            if (item.hasOwnProperty('UnitPrice') && item.hasOwnProperty('UnitsInStock')) {
                if (item.UnitPrice > 30 && item.UnitsInStock === 0) {
                    errors.push(new ValidationError(
                        ['UnitPrice', 'UnitsInStock'],
                        item,
                        'price_to_units',
                        'If units are out of stock then price cannot be higher than 30',
                    ));
                }
            }
        }

        return errors;
    }
}
