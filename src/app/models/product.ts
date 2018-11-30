import { productTypeDefaultItem } from '../default-items';

export class Product {
    public Id: number;
    public Name = '';
    public Discontinued = false;
    public Quantity = 0;
    public Price = 0;
    public ProductTypeId = productTypeDefaultItem.Id; // get from Server side
    public ProductTypeName = productTypeDefaultItem.Name; // get from Server side //turn in obj below
    
    public ProductType: ProductType = productTypeDefaultItem;

    constructor(Id: number) {
        this.Id = Id;
    }
}


export class ProductType {
    constructor(
        public Id: number,
        public Name: string
    ) {}
}
