import { ValidationErrors, ValidatorFn } from '@angular/forms';

export interface ISchema {
    fields: Field[];
    uniqueConstraints?: string[];
    multiFieldValidators: object;
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

export interface IField {
    name: string;
    editable: boolean;
    type: string;
    validators: any;
}

export class Field implements IField {
    name: string;
    editable: boolean;
    type: string;
    validators: any;

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}
