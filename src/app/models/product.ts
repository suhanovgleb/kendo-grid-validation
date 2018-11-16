
export class Product {
    public Id: number;
    public Name = '';
    public Discontinued = false;
    public Quantity = 0;
    public Price = 0;
    public ProductTypeId: number; // get from Server side
    public ProductTypeName: string; // get from Server side //turn in obj below
    
    public ProductType: ProductType;

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
