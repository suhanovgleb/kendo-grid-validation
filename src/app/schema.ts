
export interface Schema {
    fields: Field[];
    uniqueConstraints?: string[];
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
                required: true
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
    public uniqueConstraints = ['ProductName'];
}
