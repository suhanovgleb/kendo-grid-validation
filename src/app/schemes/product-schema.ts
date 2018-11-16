
import { ISchema, RowValidators, RowValidator, Field } from './schema';
import { Validators } from '@angular/forms';
import {
    MaxValidator, 
    MinValidator, 
    RequiredValidator, 
    UniqueConstraintsValidator, 
    PriceToUnitValidator,
    PriceToTypeValidator,
    IValidator
} from '../validation';
import { ProductType } from '../models/product';


export class ProductSchema implements ISchema {

    public idField = 'Id';

    public testFields = [
        /*new Field(*/{
            name: 'ProductType',
            viewSettings: {
                field: 'ProductType.Name', // Or maybe ProductTypeName somehow
                type: 'string',
                editable: true,
                validators: {
                    required: true
                }
            },
            type: ProductType,
            dbFields: [
                /*new dbField(*/{
                    name: 'ProductTypeId',
                    asPropertyName: 'Id',
                    type: 'number'
                }/*)*/,
                /*new dbField(*/{
                    name: 'ProductTypeName',
                    asPropertyName: 'Name',
                    type: 'string'
                }/*)*/
            ]
        }/*)*/
    ];

    public fields = [
        new Field({
            name: 'Id',
            editable: false,
            type: 'number',
            validators: {
                required: false
            }
        }),
        new Field({
            name: 'Name',
            editable: true,
            type: 'string',
            validators: {
                required: true
            }
        }),
        new Field({
            name: 'Price',
            editable: true,
            type: 'number',
            validators: {
                required: true,
                min: 3
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
        new Field({
            name: 'Quantity',
            editable: true,
            type: 'number',
            validators: {
                required: true,
                max: 9999
            }
        }),
        new Field({
            name: 'ProductType',
            editable: true,
            type: 'string',
            validators: {
                required: false
            }
        })
    ];

    public rowValidators: RowValidators = {
        // Validators that depend on more than one row, e.g. unique constraint validator
        multiRowValidators: [
            new RowValidator({
                name: 'uniqueConstraints',
                option: ['Name', 'Discontinued'],
                validatorRef: new UniqueConstraintsValidator()
            })
        ],
        // Validators that depend on only one row, but on several fields
        singleRowValidators: [
            new RowValidator({
                name: 'priceToUnitValidator',
                option: true, // This isnt checking
                validatorRef: new PriceToUnitValidator()
            })
        ]
    };

    // Get validators for validation service
    public getServiceValidators(): IValidator[] {
        return [
            new RequiredValidator(),
            new MaxValidator(),
            new MinValidator(),
            new UniqueConstraintsValidator(),
            new PriceToUnitValidator(),
            new PriceToTypeValidator()
        ];
    }

    // Get Angular on-form validators for one field 
    public getFieldFormValidators(field: Field) {
        const schemaValidators = field.validators;

        const formValidators: any[] = [];

        for (const validator in schemaValidators) {
            if (validator !== undefined) {
                if (validator === 'max') {
                    formValidators.push(Validators.max(schemaValidators.max));
                }
                if (validator === 'min') {
                    formValidators.push(Validators.min(schemaValidators.min));
                }
                if (validator === 'required' && schemaValidators.required) {
                    formValidators.push(Validators.required);
                }
            }
        }
        return formValidators;
    }
}
