import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { IValidator } from '../validation';

export interface ISchema {
    // Field that is used as Id
    idField: string;
    // Data fields with its all information
    fields: Field[];
    // Description of complex validators
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

export interface IRowValidator {
    // Name of the validator
    name: string;
    // Describes if validator enabled or by what field it checks values
    option: any;
    // Reference to validator class
    validatorRef: IValidator;
}

export class RowValidator implements IRowValidator {
    name: string;
    option: any;
    validatorRef: IValidator;
    constructor(
        params: RowValidatorParams
    ) {
        const props = Object.keys(params);
        for (const prop of props) {
            this[prop] = params[prop];
        }
    }
}

export class RowValidatorParams implements IRowValidator {
    name: string;
    option: any;
    validatorRef: IValidator;
}

export class Field {
    name: string;
    type: string;
    editable: boolean;
    validators: any;
    dbFields: DbField[] = [];

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}

export class DbField {
    name: string;
    asPropertyName: string;
    type: string;

    public constructor(init?: Partial<DbField>) {
        Object.assign(this, init);
    }
}
