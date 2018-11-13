import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators';

import { ProductType } from '../models/product';
import { ProductSchema } from './../schemes/product-schema';


const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const INDEX_NOT_FOUND = -1;

// Returns index of item in data OR if nothing found -1
const itemIndex = (item: any, data: any[]): number => {
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx].ProductID === item.ProductID) {
            return idx;
        }
    }
    return -1;
};

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Injectable({
    providedIn: 'root'
})
export class EditService extends BehaviorSubject<any[]> {
    public data: any[] = []; // Data in it's current state
    public originalData: any[] = []; // Last data that came from server
    /* Items that has been created locally 
    (they can be changed locally and they will still marked as created) */
    public createdItems: any[] = [];
    public updatedItems: any[] = []; // Items that has been updated locally
    public deletedItems: any[] = []; // Items that has been deleted locally

    // public isDataLoaded = false;

    constructor(private http: HttpClient) {
        super([]);
    }

    public readProductTypes(): ProductType[] {
        return [
            new ProductType(1, 'Type 1'),
            new ProductType(2, 'Type 2'),
            new ProductType(3, 'Type 3'),
            new ProductType(4, 'Type 4')
        ];
   }

    public getFreeID() {
        let maxID = -1;
        for (const item of this.data) {
            if (item.ProductID > maxID) {
                maxID = item.ProductID;
            }
        }
        return maxID + 1;
    }

    public read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.fetch()
            .subscribe(data => {
                const schema = new ProductSchema();

                // Transforming flat data into grid data
                for (let i = 0; i < data.length; i++) {
                    if (data.hasOwnProperty(i)) {
                        for (const field of schema.testFields) {
                            if (field.dbFields.length !== 0) {
                                data[i][field.name] = {};
                                for (const dbField of field.dbFields) {
                                    data[i][field.name][dbField.asPropertyName] = data[i][dbField.name];
                                }
                            }
                        }
                    }
                }

                // for (const i in data) {
                //     if (data.hasOwnProperty(i)) {
                //         for (const field of schema.testFields) {
                //             if (field.dbFields.length !== 0) {
                //                 data[i][field.name] = {};
                //                 for (const dbField of field.dbFields) {
                //                     data[i][field.name][dbField.asPropertyName] = data[i][dbField.name];
                //                 }
                //             }
                //         }
                //     }
                // }

                // this.isDataLoaded = true;

                this.data = data;
                this.originalData = cloneData(data);
                super.next(data);
            });
    }

    public create(item: any): void {
        this.createdItems.push(item);
        this.data.unshift(item);
        super.next(this.data);
    }

    public update(item: any): void {
        if (!this.isNew(item)) {
            const index = itemIndex(item, this.updatedItems);
            if (index === INDEX_NOT_FOUND) {
                this.updatedItems.push(item);
            } else {
                this.updatedItems.splice(index, 1, item);
            }
        } else {
            const index = this.createdItems.indexOf(item);
            this.createdItems.splice(index, 1, item);
        }
    }

    public remove(item: any): void {
        let index = itemIndex(item, this.data);
        this.data.splice(index, 1);

        index = itemIndex(item, this.createdItems);
        if (index === INDEX_NOT_FOUND) {
            this.deletedItems.push(item);
        } else {
            this.createdItems.splice(index, 1);
        }

        index = itemIndex(item, this.updatedItems);
        if (index !== INDEX_NOT_FOUND) {
            this.updatedItems.splice(index, 1);
        }

        super.next(this.data);
    }

    // Is this item got from server
    public isNew(item: any): boolean {
        return item.ProductID < 0;
        // return !item.ProductID;
    }

    
    public hasChanges(): boolean {
        return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
        // Or we can write it like this:
        // /* Comparing this.data with this.original data */ 
        // This will improve the quality of result, but it will cost us a lot of performance
    }

    public saveChanges(): void {
        if (!this.hasChanges()) {
            return;
        }

        const data = this.data;
        const schema = new ProductSchema();

        // Updating flat data according to changes in grid data
        for (let i = 0; i < data.length; i++) {
            if (data.hasOwnProperty(i)) {
                for (const field of schema.testFields) {
                    if (field.dbFields.length !== 0) {
                        for (const dbField of field.dbFields) {
                            data[i][dbField.name] = data[i][field.name][dbField.asPropertyName];
                        }
                    }
                }
            }
        }
        // for (const i in data) {
        //     if (data.hasOwnProperty(i)) {
        //         for (const field of schema.testFields) {
        //             if (field.dbFields.length !== 0) {
        //                 for (const dbField of field.dbFields) {
        //                     data[i][dbField.name] = data[i][field.name][dbField.asPropertyName];
        //                 }
        //             }
        //         }
        //     }
        // }

        // for (const i in this.updatedItems) {
        //     if (this.updatedItems[i].ProductID < 0) {
        //         this.createdItems.push(this.updatedItems.splice(<number><any>i, 1));
        //     }
        // }
        // const idList = this.originalData.map(item => item.ProductID);

        // for (const i in this.updatedItems) {
        //     if (!idList.includes(this.updatedItems[i].ProductID)) {
        //         this.createdItems.push(this.updatedItems.splice(<number><any>i, 1));
        //     }
        // }

        const completed = [];

        if (this.deletedItems.length) {
            completed.push(this.sendChanges(REMOVE_ACTION, this.deletedItems));
        }

        if (this.updatedItems.length) {
            completed.push(this.sendChanges(UPDATE_ACTION, this.updatedItems));
        }

        if (this.createdItems.length) {
            completed.push(this.sendChanges(CREATE_ACTION, this.createdItems));
        }

        this.reset();

        zip(...completed).subscribe(() => this.read());
    }

    public cancelChanges(): void {
        this.reset();
        this.data = this.originalData;
        this.originalData = cloneData(this.originalData);
        super.next(this.data);
    }

    public assignValues(target: any, source: any): void {
        Object.assign(target, source);
    }

    private reset() {
        this.data = [];
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = []; 
    }

    // addProduct() {
    //     const w = this.http.get('http://localhost:3000/products').subscribe(data => console.log(data));
    //     const e = this.http.post('http://localhost:3000/products', {}).subscribe(data => console.log(data));
    //     const q = 5;
    //     return null;
    // }

    private sendChanges(action: string = '', data?: any) {
        if (action === CREATE_ACTION) {
            for (const item of this.createdItems) {
                delete item.ProductType;
                if (item.ProductID < 0) {
                    item.ProductID = this.getFreeID();
                }
                this.http.post('http://localhost:3000/products', item).subscribe();
            }
        }
        if (action === REMOVE_ACTION) {
            for (const item of this.deletedItems) {
                delete item.ProductType;
                this.http.delete('http://localhost:3000/products' + '/' + item.ProductID).subscribe();
            }
        }
        if (action === UPDATE_ACTION) {
            for (const item of this.updatedItems) {
                delete item.ProductType;
                this.http.patch('http://localhost:3000/products' + '/' + item.ProductID, item).subscribe();
            }
        }
    }

    private fetch(): Observable<any[]> {

        return this.http.get('http://localhost:3000/products')
            .pipe(map(res => <any[]>res));
        //   return this.http
        //       .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(this.data)}`, 'callback')
        //       .pipe(map(res => <any[]>res));
    }

    // private serializeModels(data?: any): string {
    //     return data ? `&models=${JSON.stringify(data)}` : '';
    // }
}
