
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { IValidator } from '../validation';

export interface ISchema {
    idField: string;
    fields: Field[];
    rowValidators: RowValidators;
    getValidators(): IValidator[];
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

export interface RowValidators {
    singleRowValidators: any;
    multiRowValidators: any;
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
