
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { IValidator } from '../validation';

export interface ISchema {
    idField: string;
    fields: Field[];
    rowValidators: RowValidators;
    // Get validators for validation service
    getServiceValidators(): IValidator[];
    // Get Angular on-form validators
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

export interface RowValidators {
    // Validators that depend on more than one row, e.g. unique constraint validator
    singleRowValidators: RowValidator[];
    // Validators that depend on only one row, but on several fields
    multiRowValidators: RowValidator[];
}

export class RowValidator implements RowValidatorParams {
    name: string;
    option: any;
    validatorRef: any;
    constructor(
        params: RowValidatorParams
    ) {
        const props = Object.keys(params);
        for (const prop of props) {
            this[prop] = params[prop];
        }
    }
}

export class RowValidatorParams implements RowValidator {
    name: string;
    option: any;
    validatorRef: any;
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
