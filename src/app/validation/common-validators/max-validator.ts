
import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';


export class MaxValidator implements IValidator {
    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'max';
        const errorMessage = '';
        
        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('max')) {
                    const maxValue = field.validators.max;
                    if (item[field.name] > maxValue) {
                        
                        errors.push(new ValidationError('q', 'q', null, 'q', ['q', 'q']));


                        

                        errors.push(new ValidationError({}: IValidationError));

                        // errors.push(new ValidationError(
                        //     [field.name], 
                        //     item, 
                        //     'max', 
                        //     field.name + ' can\'t be higher than ' + maxValue + '.')
                        // );
                    }
                }
            }
        }

        return errors;
    }
}
