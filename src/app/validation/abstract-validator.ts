import { ValidationError } from './validation-error';
import { ISchema } from '../schemes/schema';
import { IValidator } from './validator-interface';

export abstract class AbstractValidator implements IValidator {
    // Assert(schema: ISchema, changedItems: any[]): ValidationError[];
    abstract Assert(data: any, schema?: ISchema): ValidationError[];
    
    getName() {
        return (<any>this).constructor.name;
    }
}
