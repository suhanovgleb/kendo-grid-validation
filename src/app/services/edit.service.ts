import { ProductSchema } from './../schemes/product-schema';
import { ProductType } from './../models/product';
import { Chance } from 'chance';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators';
import { scheduleMicroTask } from '@angular/core/src/util';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

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
  public data: any[] = [];
  public originalData: any[] = [];
  public createdItems: any[] = [];
  public updatedItems: any[] = [];
  public deletedItems: any[] = [];

  public productTypes: ProductType[];

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

  public read() {
      if (this.data.length) {
          return super.next(this.data);
      }

      this.fetch()
          .subscribe(data => {
              this.productTypes =  this.readProductTypes();
              // foreach(data, iten) => item.ProductType = productTypeDataSource.GetOne(id ==item.ProductTypeId)



              const chance = new Chance();
              for (const item of data) {
                  item.ProductTypeId = chance.integer({ min: 1, max: 4 });
                  item.ProductTypeName = 'Type ' + item.ProductTypeId;
              }

              const schema = new ProductSchema();

              for (const i in data) {
                  // tslint:disable-next-line:forin
                  for (const field of schema.testFields) {
                      if (field.dbFields.length !== 0) {
                          data[i][field.name] = {};
                          for (const dbField of field.dbFields) {
                              data[i][field.name][dbField.asPropertyName] = data[i][dbField.name];
                          }
                      }
                  }
              }



            //   for (const dataItem of data) {
            //       // tslint:disable-next-line:forin
            //       for (const prop in dataItem) {
            //           for (const field of schema.testFields) {
            //               if (field.name === prop && field.dbFields.length !== 0) {
            //                   for (const dbField of field.dbFields) {
            //                       data[prop][field.name][dbField.asPropertyName] = data[prop][dbField.name];
            //                   }
            //               }
            //           }
            //       }
            //   }

            //   this.productTypes = this.readProductTypes();
            //   for (const item of data) {
            //       item.ProductType = this.productTypes.find(productType => {
            //           return productType.Id === item.ProductTypeId;
            //       });
            //   }


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
          if (index !== -1) {
              this.updatedItems.splice(index, 1, item);
          } else {
              this.updatedItems.push(item);
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
      if (index >= 0) {
          this.createdItems.splice(index, 1);
      } else {
          this.deletedItems.push(item);
      }

      index = itemIndex(item, this.updatedItems);
      if (index >= 0) {
          this.updatedItems.splice(index, 1);
      }

      super.next(this.data);
  }

  public isNew(item: any): boolean {
      return !item.ProductID;
  }

  public hasChanges(): boolean {
      return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
  }

  public saveChanges(): void {
      if (!this.hasChanges()) {
          return;
      }

      // debug mode
      // check if Product Data type object is existed
      // item.ProducType = {id:4, 'Last thing'}


      const completed = [];
      if (this.deletedItems.length) {
          completed.push(this.fetch(REMOVE_ACTION, this.deletedItems));
      }

      if (this.updatedItems.length) {
          completed.push(this.fetch(UPDATE_ACTION, this.updatedItems));
      }

      if (this.createdItems.length) {
          completed.push(this.fetch(CREATE_ACTION, this.createdItems));
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

  private fetch(action: string = '', data?: any): Observable<any[]> {
      return this.http
          .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`, 'callback')
          .pipe(map(res => <any[]>res));
  }

  private serializeModels(data?: any): string {
      return data ? `&models=${JSON.stringify(data)}` : '';
  }
}
