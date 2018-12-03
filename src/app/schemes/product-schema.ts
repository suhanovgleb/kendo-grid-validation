import { Validators } from '@angular/forms';
import { ISchema, RowValidators, RowValidator, Field, DbField } from './schema';
import {
    MaxValidator, 
    MinValidator, 
    RequiredValidator, 
    UniqueConstraintsValidator, 
    PriceToUnitValidator,
    PriceToTypeValidator,
    IValidator
} from '../validation';


export class ProductSchema implements ISchema {

    public idField = 'Id';

    public fields: Field[] = [
        new Field({
            name: 'Id',
            viewSettings: {
                field: 'Id',
                type: 'number',
                editable: false,
                validators: {
                    required: true
                }
            } 
        }),
        new Field({
            name: 'Name',
            viewSettings: {
                field: 'Name',
                type: 'number',
                editable: true,
                validators: {
                    required: true
                }
            } 
        }),
        new Field({
            name: 'Price',
            viewSettings: {
                field: 'Price',
                type: 'number',
                editable: true,
                validators: {
                    required: true,
                    min: 3
                }
            } 
        }),
        new Field({
            name: 'Discontinued',
            viewSettings: {
                field: 'Discontinued',
                type: 'boolean',
                editable: true,
                validators: {
                    required: false
                }
            } 
        }),
        new Field({
            name: 'Quantity',
            viewSettings: {
                field: 'Quantity',
                type: 'number',
                editable: true,
                validators: {
                    required: true,
                    max: 9999
                }
            } 
        }),
        new Field({
            name: 'ProductType',
            viewSettings: {
                field: 'ProductType.Name',
                type: 'string',
                editable: true,
                validators: {
                    required: true
                }
            },
            dbFields: [
                new DbField({
                    name: 'ProductTypeId',
                    asPropertyName: 'Id',
                    type: 'number'
                }),
                new DbField({
                    name: 'ProductTypeName',
                    asPropertyName: 'Name',
                    type: 'string'
                })
            ]
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
        const schemaValidators = field.viewSettings.validators;

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
