
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { IValidator } from '../validation';

export interface ISchema {
    idField: string;
    fields: Field[];
    multiFieldValidators: any;
    getValidators(): IValidator[];
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

export class Field {
    name: string;
    editable: boolean;
    type: string;
    validators: any;

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}
