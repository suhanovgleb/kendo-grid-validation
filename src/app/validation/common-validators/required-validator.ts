
import { ISchema } from '../../schemes/schema';
import { ValidationError, ErrorInfo } from '../validation-error';
import { IValidator } from '../interface-validator';
import { ValidatorType } from '../validator-type';


export class RequiredValidator implements IValidator {
    validatorType = ValidatorType.Simple;

    Assert(items: any[], schema: ISchema): ValidationError[] {
        const errors: ValidationError[] = [];

        const errorName = 'required';
        let errorMessage = '';

        for (const item of items) {
            for (const field of schema.fields) {
                if (field.validators.hasOwnProperty('required')) {
                    if (field.validators.required) {
                        if (
                            item[field.name] === '' ||
                            item[field.name] === null ||
                            item[field.name] === undefined
                        ) {
                            errorMessage = field.name + ' can\'t be empty.';
                            const errorInfo = new ErrorInfo(errorName, errorMessage, this.validatorType);
                            errors.push(new ValidationError(errorInfo, item, field.name));
                            // errors.push(
                            //     new ValidationError([field.name], item, 'required', field.name + ' can\'t be empty.')
                            // );
                        }
                    }
                }
            }
        }

        return errors;
    }
}
