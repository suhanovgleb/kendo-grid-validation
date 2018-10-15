

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
import { SafeStyle } from '@angular/platform-browser';

import { IdGeneratorService } from './services/id-generator.service';
import { DialogCustomService } from './services/dialog-custom.service';
import { ValidatorType } from './validation/validator-type';

import { union } from 'lodash';
import { NotificationCustomService } from './services/notification-custom.service';


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

    private numberOfAdditionalItems = 1;

    public listOfUnits: number[] = [10, 100, 1000, 10000];

    public changes: any = {};
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
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;
        this.editService.read();
    }

    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited) {
            this.formGroup = this.createFormGroup(dataItem);
            sender.editCell(rowIndex, columnIndex, this.formGroup);
        }
    }

    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            // args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
            
            // if any field of row with error was changed we repaint it
            for (const error of this.validationErrors) {
                if (error.item[this.idField] === dataItem[this.idField]) {
                    for (const field in dataItem) {
                        if (dataItem.hasOwnProperty(field)) {
                            // check if cell was changed then delete error
                            if ((dataItem[field] !== error.item[field]) && (error.fieldNames.includes(field))) {
                                if (error.errorInfo.errorType === ValidatorType.UniqueConstraint) {
                                    const sameConstraintErrors = this.validationErrors.filter((e) => {
                                        if (e.errorInfo.errorType === ValidatorType.UniqueConstraint) {
                                            return e;
                                        }
                                    });
                                    if (sameConstraintErrors.length === 2) {
                                        for (const err of sameConstraintErrors) {
                                            const idx = this.validationErrors.indexOf(error);
                                            this.validationErrors.splice(idx, 1);
                                        }
                                    } else { 
                                        const index = this.validationErrors.indexOf(error);
                                        this.validationErrors.splice(index, 1);
                                    }
                                } else {
                                    const index = this.validationErrors.indexOf(error);
                                    this.validationErrors.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
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
            this.notificationService.saveSuccessfullyNotification();
            this.idGeneratorService.reset();
        } else {
            this.notificationService.savePreventedNotification();
        }
    }

    public cancelChanges(grid: GridComponent): void {
        grid.cancelCell();
        this.editService.cancelChanges();

        this.notificationService.cancelChangesNotification();

        this.validationErrors = [];
        this.idGeneratorService.reset();
    }



    public addSomeItems(grid: GridComponent) {
        const chance = new Chance();
        for (let i = 0; i < this.numberOfAdditionalItems; i++) {
            const item = new Product(this.idGeneratorService.getId());
            item.ProductName = chance.street();
            item.UnitPrice = chance.floating({ fixed: 2, min: 4, max: 200 });
            item.Discontinued = chance.integer() % 3 === 0 ? true : false;
            item.UnitsInStock = chance.integer({ min: 0, max: 9999 });
            this.editService.create(item);
        }
    }

    markup(dataItem: any, columnInfo: ColumnComponent): SafeStyle {
        // const metadata = { 
        //     dataItem: dataItem,
        //     columnInfo: columnInfo,
        //     validationErrors: this.validationErrors,
        //     schema: this.schema 
        // };
        return this.markupService.doMarkup(dataItem, columnInfo, this.validationErrors, this.schema);   
    }

    public showErrorsDialog() {
        // this.dialogService.showErrorsCount(this.validationErrors);
        this.dialogService.showErrorsList(this.validationErrors, this.schema);
    }

    public tooltipHandler(validationErrors: ValidationError[], columnInfo: ColumnComponent, dataItem: any) {
        const idField = this.schema.idField;
        let tooltipMessage = '';
        validationErrors.filter((error) => {
            if (error.item[idField] === dataItem[idField]) {
                if (error.fieldNames.includes(columnInfo.field)) {
                    tooltipMessage += error.errorInfo.errorMessage + '\n';
                }
            }
        });
        return tooltipMessage;
    }

    // Main FormGroup validation with in-form validaton
    public MAINcreateFormGroup(dataItem): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        const editableFields = this.schema.fields.filter(field => {
            if (field.editable) { return field; }
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
            if (field.editable) { return field; }
        });

        for (const field of editableFields) {
            // const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(dataItem[field.name]);
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

}
