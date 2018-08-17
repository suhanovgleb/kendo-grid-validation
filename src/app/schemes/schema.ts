import { Validators, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface Schema {
    fields: Field[];
    uniqueConstraints?: string[];
    getFormValidators?(field: Field): (ValidatorFn | ValidationErrors)[];
}

export class Field {
    name: string;
    editable: boolean;
    type: string;
    validatiors: any;

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}

export class ProductSchema implements Schema {

    public fields = [
        new Field({
            name: 'ProductID',
            editable: false,
            type: 'number',
            validatiors: {
                required: false
            }
        }),
        new Field({
            name: 'ProductName',
            editable: true,
            type: 'string',
            validatiors: {
                required: true
            }
        }),
        new Field({
            name: 'UnitPrice',
            editable: true,
            type: 'number',
            validatiors: {
                required: false,
                min: 3
            }
        }),
        new Field({
            name: 'UnitsInStock',
            editable: true,
            type: 'number',
            validatiors: {
                required: false,
                max: 9999
            }
        }),
        new Field({
            name: 'Discontinued',
            editable: true,
            type: 'boolean',
            validatiors: {
                required: false
            }
        }),
    ];

    public uniqueConstraints = ['ProductName', 'Discontinued'];

    public getFormValidators(field: Field) {
        const schemaValidators = field.validatiors;

        const formValidators: any[] = [];

        for (const validator in schemaValidators) {
            if (validator !== undefined) {
                switch (validator) {
                    case 'max': {
                        formValidators.push(Validators.max(schemaValidators.max));
                        break;
                    }
                    case 'min': {
                        formValidators.push(Validators.min(schemaValidators.min));
                        break;
                    }
                    case 'required': {
                        if (schemaValidators.required) {
                            formValidators.push(Validators.required);
                        }
                        break;
                    }
                    default: {
                        console.log('default');
                        break;
                    }
                }
            }
        }
        return formValidators;
    }
}
