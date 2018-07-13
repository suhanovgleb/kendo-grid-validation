
export interface Schema {
    fields: Field[];
    uniqueConstraints?: string[];
}

class Field {
    name: string;
    editable: boolean;
    type: any;
    validation: Object;

    public constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }
}

export class ProductSchema implements Schema {

    public fields = [
        new Field ({ name: 'ProductID', editable: false, type: 'number', validation: { required: true } }),
        new Field ({ name: 'ProductName', editable: true, type: 'string', validation: { required: true } }),
        new Field ({ name: 'UnitPrice', editable: true, type: 'number', validation: { required: false } }),
        new Field ({ name: 'UnitsInStock', editable: true, type: 'number', validation: { required: false } }),
        new Field ({ name: 'Discounted', editable: true, type: 'boolean', validation: { required: false } }),
     ];
    public uniqueConstraints = ['ProductName'];
}

// --------------------------------------------------------------------------------------------------------

// { name: 'ProductID', editable: false, type: 'number', validation: { required: true } },
//         { name: 'ProductName', editable: true, type: 'string', validation: { required: true } },
//         { name: 'UnitPrice', editable: true, type: 'number', validation: { required: false } },
//         { name: 'UnitsInStock', editable: true, type: 'number', validation: { required: false } },
//         { name: 'Discounted', editable: true, type: 'boolean', validation: { required: false } }



// let schema: {
//     fields: {
//         ProductID: {
//             editable: false,
//             type: number,
//             validation: { required: true }      // using on change and on save
//         },
//         ProductName: {
//             editable: true,
//             type: string,
//             validation: { required: true }
//         },
//         UnitPrice: {
//             editable: true,
//             type: number,
//             validation: { required: false }
//         },
//         UnitsInStock: {
//             editable: true,
//             type: number,
//             validation: { required: false }
//         },
//         Discounted: {
//             editable: true,
//             type: boolean,
//             validation: { required: false }
//         }
//     },
//     uniqueConstraints: ['ProductName'],
// };
