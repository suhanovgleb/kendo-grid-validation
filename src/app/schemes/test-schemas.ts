import { ProductType, Product } from '../models/product';

class TestSchemas {
    public newFields = [
        {
            name: 'ProductType',
            viewSettings: {
                editable: true,
                type: 'string'
            },
            dbSettings: {
                type: ProductType
            },
            dbFields: [
                {
                    name: 'ProductTypeId',
                    type: 'number'
                },
                {
                    name: 'ProductTypeName',
                    type: 'string'
                }
            ]
        }
        // {
        //     name: 'ProductTypeId'
        //     dbSettings: {
        //         type: 'number'
        //     }

        // }
    ];

    public newFields2 = [
        {
            name: 'ProductType',
            viewSettings: {
                editable: true,
                type: 'string'
            },
            dbSettings: {
                type: ProductType
            }
        },
        {
            name: 'ProductTypeId',
            dbSettings: {
                type: 'number'
            }

        }
    ];

    public newFields3 = [
        {
            name: 'ProductType',
            editable: true,
            viewField: 'ProductType.Name', // Or maybe ProductTypeName
            viewType: 'string',
            validators: {
                required: true
            },
            type: ProductType,
            dbFields: [
                {
                    name: 'ProductTypeId',
                    asPropertyName: 'Id',
                    type: 'number'
                },
                {
                    name: 'ProductTypeName',
                    asPropertyName: 'Name',
                    type: 'string'
                }
            ]
        }
    ];

    public newFields4 = [
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

    public dbItem = {
        Id: 1,
        Name: 'Chai',
        ProductTypeId: 1,
        ProductTypeName: 'Type 1'
    };

    getObjectFromField(dbItem) {
        for (const prop in dbItem) {
            
        }
    }
}

