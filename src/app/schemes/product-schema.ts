
import { ISchema, Field } from './schema';
import { Validators } from '@angular/forms';
import {
    MaxValidator, 
    MinValidator, 
    RequiredValidator, 
    UniqueConstraintsValidator, 
    PriceToUnitValidator,
    IValidator
} from '../validation';


export class ProductSchema implements ISchema {

    public fields = [
        new Field({
            name: 'ProductID',
            editable: false,
            type: 'number',
            validators: {
                required: false
            }
        }),
        new Field({
            name: 'ProductName',
            editable: true,
            type: 'string',
            validators: {
                required: true
            }
        }),
        new Field({
            name: 'UnitPrice',
            editable: true,
            type: 'number',
            validators: {
                required: true,
                min: 3
            }
        }),
        new Field({
            name: 'UnitsInStock',
            editable: true,
            type: 'number',
            validators: {
                required: false,
                max: 9999
            }
        }),
        new Field({
            name: 'Discontinued',
            editable: true,
            type: 'boolean',
            validators: {
                required: false
            }
        }),
    ];


    // Validators that depends on more than one field
    public multiFieldValidators = {
        uniqueConstraints: ['ProductName', 'Discontinued'],
        priceToUnitValidator: true,
    };

    // Get service validators
    public getValidators(): IValidator[] {
        return [
            new RequiredValidator(), 
            new MaxValidator(), 
            new MinValidator(), 
            new PriceToUnitValidator(), 
            new UniqueConstraintsValidator()
        ];
    }

    // Get Angular on-form validators from scheme
    public getFieldFormValidators(field: Field) {
        const schemaValidators = field.validators;

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
