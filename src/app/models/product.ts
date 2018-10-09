
export class Product {
    public ProductID: number;
    public ProductName = '';
    public Discontinued = false;
    public UnitsInStock = 0;
    public UnitPrice = 0;

    constructor(Id: number) {
        this.ProductID = Id;
    }
}


