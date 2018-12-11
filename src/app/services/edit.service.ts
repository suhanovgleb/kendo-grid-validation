import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators';

import { ProductType } from '../models/product';
import { environment } from './../../environments/environment';
import { ProductSchema } from './../schemes/product-schema';
import { NotificationCustomService } from './notification-custom.service';

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

const itemIndexById = (Id: number, data: any[]): number => {
    const schema = new ProductSchema();
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx][schema.idField] === Id) {
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

    public isDataProcessing = false;

    constructor(
        private http: HttpClient,
        private notificationService: NotificationCustomService) {
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

    public updateView() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.read()
            .subscribe(data => {
                this.transformFlatToGridData(data);
                this.data = data;
                this.originalData = cloneData(data);
                super.next(data);
                this.notificationService.successNotification('Data has been loaded from server');
                this.isDataProcessing = false;
            },
            (error) => {
                this.notificationService.errorNotification('An error has occurred. Data hasn\'nt been reloaded from server');
                this.isDataProcessing = false;
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

        this.transformGridToFlatData(data);

        let completed: Observable<any>[] = [];

        if (this.updatedItems.length) {
            completed = completed.concat(this.sendChanges(UPDATE_ACTION, this.updatedItems));
        }

        if (this.deletedItems.length) {
            completed = completed.concat(this.sendChanges(REMOVE_ACTION, this.deletedItems));
        }

        if (this.createdItems.length) {
            completed = completed.concat(this.sendChanges(CREATE_ACTION, this.createdItems));
        }

        // When it get all responses it initiates reading
        zip(...completed).subscribe((returnedItemData) => {
            this.resetTempStorages();

            for (const itemData of returnedItemData) {
                const idx = itemIndexById(itemData.OldId, data);
                if (idx !== INDEX_NOT_FOUND) {
                    if (itemData.OldId > 0) {
                        this.data.splice(idx, 1, itemData.SavedProduct);
                    } else {
                        this.data.splice(idx, 1);
                        this.data.push(itemData.SavedProduct);
                    }
                }
            }

            this.transformFlatToGridData(data);

            this.originalData = cloneData(this.data);
            this.updateView();
            this.notificationService.successNotification('Data has been successfully saved');
            this.isDataProcessing = false;
        },
        (error) => {
            this.notificationService.errorNotification('Server couldn\'t save changes');
            this.isDataProcessing = false;
        });
    }

    private transformFlatToGridData(dataSource: any[]) {
        for (let i = 0; i < dataSource.length; i++) {
            // Seems like unessesary condition check
            if (dataSource.hasOwnProperty(i)) {
                for (const field of this.schema.fields) {
                    if (field.dbFields.length !== 0) {
                        dataSource[i][field.name] = {};
                        for (const dbField of field.dbFields) {
                            dataSource[i][field.name][dbField.asPropertyName] = dataSource[i][dbField.name];
                        }
                    }
                }
            }
        }
    }

    private transformGridToFlatData(dataSource: any[]) {
        for (let i = 0; i < dataSource.length; i++) {
            // Seems like unessesary condition check
            if (dataSource.hasOwnProperty(i)) {
                for (const field of this.schema.fields) {
                    if (field.dbFields.length !== 0) {
                        for (const dbField of field.dbFields) {
                            dataSource[i][dbField.name] = dataSource[i][field.name][dbField.asPropertyName];
                        }
                    }
                }
            }
        }
    }

    public cancelChanges(): void {
        this.reset();
        this.data = this.originalData;
        this.originalData = cloneData(this.originalData);
        super.next(this.data);
        this.notificationService.infoNotification('Changed data has been reset.');
    }

    public assignValues(target: any, source: any): void {
        Object.assign(target, source);
    }

    public reloadData() {
        this.reset();
        this.updateView();
    }

    private reset() {
        this.data = [];
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = []; 
    }

    private resetTempStorages() {
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = []; 
    }

    private sendChanges(action: string = '', data: any): Observable<any>[] {
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

    private read(): Observable<any[]> {
        return this.http.get(environment.apiURL).pipe(map(res => <any[]>res));
    }
}
