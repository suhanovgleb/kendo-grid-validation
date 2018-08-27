
import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';


export class MinValidator implements IValidator {
    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('min')) {
                    const minValue = field.validators.min;
                    if (item[field.name] < minValue) {
                        errors.push(new ValidationError(
                            [field.name],
                            item,
                            'min',
                            field.name + ' can\'t be less than ' + minValue + '.')
                        );
                    }
                }
            }
        }

        return errors;
    }
}
