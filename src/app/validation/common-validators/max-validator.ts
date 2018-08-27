
import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';


export class MaxValidator implements IValidator {
    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];
        
        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('max')) {
                    const maxValue = field.validators.max;
                    if (item[field.name] > maxValue) {
                        errors.push(new ValidationError(
                            [field.name], 
                            item, 
                            'max', 
                            field.name + ' can\'t be higher than ' + maxValue + '.')
                        );
                    }
                }
            }
        }

        return errors;
    }
}
