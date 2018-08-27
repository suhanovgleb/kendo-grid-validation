
import { ISchema } from '../../schemes/schema';
import { ValidationError } from '../validation-error';
import { IValidator } from '../interface-validator';


export class RequiredValidator implements IValidator {
    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('required')) {
                    if (field.validators.required) {
                        if (
                            item[field.name] === '' ||
                            item[field.name] === null ||
                            item[field.name] === undefined
                        ) {
                            errors.push(new ValidationError(
                                [field.name],
                                item,
                                'required',
                                field.name + ' can\'t be empty.')
                            );
                        }
                    }
                }
            }
        }

        return errors;
    }
}
