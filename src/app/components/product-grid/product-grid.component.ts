import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeStyle } from '@angular/platform-browser';
import { ColumnComponent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { Chance } from 'chance';
import { union } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { Product, ProductType } from '../../models/product';
import { ProductSchema } from '../../schemes/product-schema';
import { DialogCustomService } from '../../services/dialog-custom.service';
import { EditService } from '../../services/edit.service';
import { IdGeneratorService } from '../../services/id-generator.service';
import { MarkupService } from '../../services/markup.service';
import { NotificationCustomService } from '../../services/notification-custom.service';
import { ValidationService } from '../../services/validation.service';
import { ValidationError } from '../../validation';
import { productTypeDefaultItem } from 'src/app/default-items';


@Component({
  selector: 'app-product-grid',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {
    public view$: Observable<GridDataResult>;

    readonly originalGridState: State = {
        sort: [],
        skip: 0,
        take: 50,
        group: []
    };

    public gridState: State = {
        sort: [],
        skip: 0,
        take: 50,
        group: []
    };

    private numberOfAdditionalItems = 1;

    public isDataLoaded = false;
    // Do we need default item?
    public defaultItem: ProductType = productTypeDefaultItem;
    public productTypes: ProductType[];

    private schema = new ProductSchema();
    private idField = this.schema.idField;

    private validationErrors: ValidationError[] = [];

    public formGroup: FormGroup;

    public ಠ_ಠ = 'ಠ_ಠ';
    constructor(
        private editService: EditService,
        private validationService: ValidationService,
        private markupService: MarkupService,
        private idGeneratorService: IdGeneratorService,
        private dialogService: DialogCustomService,
        private notificationService: NotificationCustomService
    ) {
        console.log(this.ಠ_ಠ);
    }

    public ngOnInit(): void {
        this.view$ = this.editService.pipe(map(data => process(data, this.gridState)));
        this.productTypes = this.editService.readProductTypes();
        //// this.gridState = this.originalGridState;
        // this.editService.updateView();
        // this.isDataLoaded = true;
    }

    public onStateChange(state: State) {
        this.gridState = state;
        this.editService.updateView();
    }

    public refreshButtonHandler(grid: GridComponent) {
        this.editService.isDataProcessing = true;
        grid.closeRow(-1);
        this.gridState = this.originalGridState;
        this.editService.reloadData();
        this.isDataLoaded = true;
    }

    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited) {
            this.formGroup = this.createFormGroup(dataItem);
            sender.editCell(rowIndex, columnIndex, this.formGroup);
        }
    }

    public cellCloseHandler(args: any) {
        const formGroup: FormGroup = args.formGroup;
        const dataItem: any = args.dataItem;
        // const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            // args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
            
            // if any field of row with error was changed we repaint it
            this.validationService.removePairedErrors(this.validationErrors, dataItem, this.idField);
        }
    }
    
    public addHandler({ sender }) {
        this.formGroup = this.createFormGroup(new Product(this.idGeneratorService.getId()));
        sender.addRow(this.formGroup);
    }

    public cancelHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
    }

    public saveHandler({ sender, formGroup, rowIndex }) {
        if (formGroup.valid) {
            const dataItem = formGroup.value;
            if (!dataItem.hasOwnProperty(this.schema.idField)) {
                dataItem[this.schema.idField] = this.idGeneratorService.getId();
            }
            this.editService.create(dataItem);
            sender.closeRow(rowIndex);
        }
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);
        sender.cancelCell();
    }  

    public saveChanges(grid: GridComponent): void {
        this.editService.isDataProcessing = true;
        const SAVE_PREVENDED_MESSAGE = 'There are some errors. Saving is not possible.';

        grid.closeCell();
        grid.cancelCell();
        
        const datasets: object = {
            changedItems: union(this.editService.updatedItems, this.editService.createdItems),
            allItems: this.editService.data
        };

        this.validationErrors = [];

        this.validationErrors = this.validationService.validate(this.schema, datasets);

        // Prevents items from changing in the validationError array
        for (const error of this.validationErrors) {
            error.item = Object.assign({}, error.item);
        }
        
        if (this.validationErrors.length === 0) {
            this.editService.saveChanges();
            this.idGeneratorService.reset();
        } else {
            this.notificationService.errorNotification(SAVE_PREVENDED_MESSAGE);
            this.editService.isDataProcessing = false;
        }
    }

    public cancelChanges(grid: GridComponent): void {
        grid.cancelCell();
        this.gridState = this.originalGridState;
        this.editService.cancelChanges();
        this.validationErrors = [];
        this.idGeneratorService.reset();
    }

    public addSomeItems(grid: GridComponent) {
        const chance = new Chance();
        for (let i = 0; i < this.numberOfAdditionalItems; i++) {
            const item = new Product(this.idGeneratorService.getId());
            
            item.Name = chance.animal();
            item.Price = chance.floating({ fixed: 2, min: 100, max: 9999 });
            item.Discontinued = chance.integer() % 3 === 0 ? true : false;
            item.Quantity = chance.integer({ min: 0, max: 9999 });
            const productTypeId = chance.integer({ min: 1, max: 4 });
            item.ProductType = new ProductType(productTypeId, 'Type ' + productTypeId);
            item.ProductTypeId = productTypeId;
            item.ProductTypeName = 'Type ' + productTypeId;

            this.editService.create(item);
        }
    }

    markup(dataItem: any, columnInfo: ColumnComponent): SafeStyle {
        return this.markupService.doMarkup(dataItem, columnInfo, this.validationErrors, this.schema);   
    }

    public showErrorsDialog() {
        this.dialogService.showErrorsList(this.validationErrors, this.schema);
    }

    public tooltipHandler(validationErrors: ValidationError[], columnInfo: ColumnComponent, dataItem: any) {
        const idField = this.schema.idField;
        let tooltipMessage = '';
        for (const error of validationErrors) {
            if (error.item[idField] === dataItem[idField]) {
                if (error.fieldNames.includes(columnInfo.field)) {
                    tooltipMessage += error.errorInfo.errorMessage + '\n';
                }
            }
        }
        return tooltipMessage;
    }

    // Main FormGroup validation with in-form validaton
    public MAINcreateFormGroup(dataItem): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        const editableFields = this.schema.fields.filter(field => {
            if (field.viewSettings.editable) { return field; }
        });

        for (const field of editableFields) {
            const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(dataItem[field.name], Validators.compose(validators));
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

    // FormGroup without form validation, (!!!) USE ONLY FOR VALIDATION SERVICE TESTING
    public createFormGroup(dataItem): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        const editableFields = this.schema.fields.filter(field => {
            if (field.viewSettings.editable) { return field; }
        });

        for (const field of editableFields) {
            // const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(dataItem[field.name]);
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }
}
