import { IValidator } from './validator-interface';
import { ISchema } from '../schemes/schema';
import { ValidationError } from './validation-error';

export class UniqueConstraintsValidator implements IValidator {
    Assert(schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];
        // if (gridRowItem.UnitPrice > 30 && gridRowItem.UnitsInStock === 0) {
        //     errors.push( new ValidationError(
        //                 null, 
        //                 gridRowItem, 
        //                 'price_to_units', 
        //                 'If units are out of stock then price cannot be higher than 30', 
        //                 ['UnitPrice', 'UnitsInStock']
        //             ));
        // }   
        return errors;
    }
}
