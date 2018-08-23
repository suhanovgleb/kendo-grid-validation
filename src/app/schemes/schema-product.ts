import { ISchema, Field } from './schema';
import { Validators } from '@angular/forms';

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
                required: false,
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

    // Fields that will validate as primary key
    public uniqueConstraints = ['ProductName', 'Discontinued'];

    // Validators that depends on more than one field
    public multiFieldValidators = {
        'PriceToUnitValidator': true,
        'OtherValidator': 'yes'
    };

    public GetSingleFieldValidators() {
        
    }

    //#region Get multiFieldValidators
    // // Get multiFieldValidators
    // public getValidatorsParams() {
        
    //     const validators: object = {};

    //     // Take validators from multiFieldValidators()
    //     for (const validator in this.multiFieldValidators) {
    //         if (this.multiFieldValidators.hasOwnProperty(validator)) {
    //             // ...
    //         }
    //     }
        
    //     // Take uniqueConstraints validator
        

    //     return null;
    // }
    //#endregion

    // Get Angular on-form validators from scheme
    public getFormValidators(field: Field) {
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
