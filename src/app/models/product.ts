
export class Product {
    public ProductID: number;
    public ProductName = '';
    public Discontinued = false;
    public UnitsInStock = 0;
    public UnitPrice = 0;
    public ProductTypeId: number; // get from Server side
    public ProductTypeName: string; // get from Server side //turn in obj below
    
    public ProductType: ProductType;

    constructor(Id: number) {
        this.ProductID = Id;
    }
}


export class ProductType {
    constructor(
        public Id: number,
        public Name: string
    ) {}
}
