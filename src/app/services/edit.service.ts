import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators';

import { ProductType } from '../models/product';
import { environment } from './../../environments/environment';
import { ProductSchema } from './../schemes/product-schema';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const INDEX_NOT_FOUND = -1;

// Returns index of item in data OR if nothing found -1
const itemIndex = (item: any, data: any[]): number => {
    const schema = new ProductSchema();
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx][schema.idField] === item[schema.idField]) {
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
    // Data in it's current state
    public data: any[] = [];
    // Last data that came from server
    public originalData: any[] = [];
    // Items that has been created locally 
    // (they can be changed locally and they will still marked as created)
    public createdItems: any[] = [];
    // Items that has been updated locally
    public updatedItems: any[] = [];
    // Items that has been deleted locally
    public deletedItems: any[] = [];

    public schema = new ProductSchema();

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

    public  read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.fetch()
            .subscribe(data => {
                // Transforming flat data into grid data
                for (let i = 0; i < data.length; i++) {
                    if (data.hasOwnProperty(i)) {
                        for (const field of this.schema.testFields) {
                            if (field.dbFields.length !== 0) {
                                data[i][field.name] = {};
                                for (const dbField of field.dbFields) {
                                    data[i][field.name][dbField.asPropertyName] = data[i][dbField.name];
                                }
                            }
                        }
                    }
                }

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

    public isNew(item: any): boolean {
        return item[this.schema.idField] < 0;
    }
    
    public hasChanges(): boolean {
        return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
    }

    public saveChanges(): void {
        if (!this.hasChanges()) {
            return;
        }

        const data = this.data;
        
        // Updating flat data according to changes in grid data
        for (let i = 0; i < data.length; i++) {
            if (data.hasOwnProperty(i)) {
                for (const field of this.schema.testFields) {
                    if (field.dbFields.length !== 0) {
                        for (const dbField of field.dbFields) {
                            data[i][dbField.name] = data[i][field.name][dbField.asPropertyName];
                        }
                    }
                }
            }
        }

        let completed: Observable<any[]>[] = [];

        if (this.updatedItems.length) {
            completed = completed.concat(this.sendChanges(UPDATE_ACTION, this.updatedItems));
        }

        if (this.deletedItems.length) {
            completed = completed.concat(this.sendChanges(REMOVE_ACTION, this.deletedItems));
        }

        if (this.createdItems.length) {
            completed = completed.concat(this.sendChanges(CREATE_ACTION, this.createdItems));
        }

        this.reset();

        // When all updates, removes, creates are completed it initiates reading
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

    private sendChanges(action: string = '', data: any): Observable<any[]>[] {
        const result = [];

        if (action === UPDATE_ACTION) {
            for (const item of data) {
                result.push(this.http.put(`${environment.apiURL}/${item[this.schema.idField]}`, item).pipe(map(res => <any[]>res)));
            }
        }

        if (action === CREATE_ACTION) {
            for (const item of data) {
                result.push(this.http.post(`${environment.apiURL}`, item).pipe(map(res => <any[]>res)));
            }
        }

        if (action === REMOVE_ACTION) {
            for (const item of data) {
                result.push(this.http.delete(`${environment.apiURL}/${item[this.schema.idField]}`).pipe(map(res => <any[]>res)));
            }
        }

        return result;
    }

    private fetch(): Observable<any[]> {
        return this.http.get(environment.apiURL).pipe(map(res => <any[]>res));
    }
}
