
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { IValidator } from '../validation';

export interface ISchema {
    idField: string;
    fields: Field[];
    rowValidators: RowValidators;
    // Get validators for validation service
    getServiceValidators(/*fieldValidators: IValidator[]*/): IValidator[];
    // Get Angular on-form validators
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

// export abstract class Schema implements ISchema {
//     idField: string;
//     fields: Field[];
//     rowValidators: RowValidators;
//     // Get validators for validation service
//     getServiceValidators(fieldValidators: IValidator[]): IValidator[] {
//         const serviceValidators: IValidator[] = [];
//         const allRowValidators: RowValidator[] = this.rowValidators.multiRowValidators
//             .concat(this.rowValidators.singleRowValidators);
//         for (const validator of allRowValidators) {
//             serviceValidators.push(validator.validatorRef);
//         }
//         serviceValidators.push(...fieldValidators);
//         return serviceValidators;
//     }
//     // Get Angular on-form validators
//     getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
// }

export interface RowValidators {
    // Validators that depend on more than one row, e.g. unique constraint validator
    singleRowValidators: RowValidator[];
    // Validators that depend on only one row, but on several fields
    multiRowValidators: RowValidator[];
}

export interface IRowValidator {
    name: string;
    option: any;
    validatorRef: any;
}

export class RowValidator implements IRowValidator {
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

export class RowValidatorParams implements IRowValidator {
    name: string;
    option: any;
    validatorRef: any;
}

export class Field {
    name: string;

    viewSettings: ViewSettings;
    type: string;
    dbFields: DbField[] = [];

    // editable: boolean;
    
    // validators: any;

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}

export class ViewSettings {
    // Field by what data will shown and SORTED
    field: string;
    type: string;
    editable: boolean;
    validators: any;
}

export class DbField {
    name: string;
    asPropertyName: string;
    type: string;

    public constructor(init?: Partial<DbField>) {
        Object.assign(this, init);
    }
}
