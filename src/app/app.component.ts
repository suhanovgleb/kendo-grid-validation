
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { GridDataResult, GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './models/product';
import { EditService } from './services/edit.service';
import { ValidationService } from './services/validation.service';

import { map } from 'rxjs/operators/map';

import { ProductSchema } from './schemes/product-schema';
import { MarkupService } from './services/markup.service';
import { ValidationError } from './validation';

import { Chance } from 'chance';


@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public view: Observable<GridDataResult>;
    
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };

    private numberOfAdditionalItems = 10000;

    public changes: any = {};
    private schema = new ProductSchema();

    private validationErrors: ValidationError[] = [];

    public ಠ_ಠ = 'ಠ_ಠ';    

    constructor(
        private editService: EditService,
        private validationService: ValidationService,
        private markupService: MarkupService
    ) {
        console.log(this.ಠ_ಠ);
    }
    
    public ngOnInit(): void {
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;
        this.editService.read();
    }

    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
        }
    }

    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;

        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
    }
    
    public addHandler({ sender }) {
        sender.addRow(this.createFormGroup(new Product()));
    }

    public cancelHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
    }

    public saveHandler({ sender, formGroup, rowIndex }) {
        if (formGroup.valid) {
            this.editService.create(formGroup.value);
            sender.closeRow(rowIndex);
        }

        // Maybe this must be in the other place, pay attention when formValidation will be enabled
        this.markupService.doMarkup(this.editService.data, this.validationErrors);
        
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);
        sender.cancelCell();
    }  

    public saveChanges(grid: GridComponent): void {
        grid.closeCell();
        grid.cancelCell();
        
        const datasets: object = {
            changedItems: this.editService.updatedItems.concat(this.editService.createdItems),
            allItems: this.editService.data
        };

        this.validationErrors = this.validationService.validate(this.schema, datasets);

        this.editService.saveChanges();
    }

    public cancelChanges(grid: GridComponent): void {
        grid.cancelCell();
        this.editService.cancelChanges();
    }

    public addSomeItems(grid: GridComponent) {
        const chance = new Chance();
        for (let i = 0; i < this.numberOfAdditionalItems; i++) {
            const item = new Product();
            item.ProductName = chance.street();
            item.UnitPrice = chance.floating({ fixed: 2, min: 4, max: 200 });
            item.Discontinued = chance.integer() % 3 === 0 ? true : false;
            item.UnitsInStock = chance.integer({ min: 0, max: 9999 });
            this.editService.create(item);
        }
    }

    // must return by sanitizer
    markup(dataItem: any, columnInfo: ColumnComponent) {
        if (dataItem.ProductName[0] === 'A' && (columnInfo.field === 'ProductName')) {
            return 'lightcoral';
        }
        if (dataItem.ProductName[0] === 'B' && (columnInfo.field === 'ProductName')) {
            return 'lightcoral';
        }
        if (dataItem.ProductName[0] === 'C' && (columnInfo.field === 'ProductName')) {
            return 'lightcoral';
        }
        if (dataItem.ProductName[0] === 'D' && (columnInfo.field === 'ProductName')) {
            return 'lightcoral';
        }
        if (dataItem.ProductName[0] === 'E' && (columnInfo.field === 'ProductName')) {
            return 'lightcoral';
        }
        if (dataItem.UnitPrice >= 100 && (columnInfo.field === 'UnitPrice')) {
            return 'lightcoral';
        }
    }

    // Main FormGroup validation with in-form validaton
    public MAINcreateFormGroup(currentData): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        const editableFields = this.schema.fields.filter(field => {
            if (field.editable) { return field; }
        });

        for (const field of editableFields) {
            const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(currentData[field.name], Validators.compose(validators));
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

    // FormGroup without form validation, (!!!) USE ONLY FOR VALIDATION SERVICE TESTING
    public createFormGroup(currentData): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        const editableFields = this.schema.fields.filter(field => {
            if (field.editable) { return field; }
        });

        for (const field of editableFields) {
            // const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(currentData[field.name]);
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

}
