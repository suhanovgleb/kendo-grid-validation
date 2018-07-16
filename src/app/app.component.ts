import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, ValidationErrors } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './services/edit.service';
import { ValidationService } from './services/validation.service';

import { map } from 'rxjs/operators/map';

import { ProductSchema, Field } from './schema';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public view: Observable<GridDataResult>;
    
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 17
    };

    public changes: any = {};
    public schema = new ProductSchema();

    public ಠ_ಠ = 'ಠ_ಠ';    

    constructor(
        private formBuilder: FormBuilder,
        public editService: EditService,
        private validationService: ValidationService
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
        // this.validatorsMapping(this.schema.fields[columnIndex + 1]);
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroup(this.schema, dataItem));
        }
    }

    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;

        if (!formGroup.valid) {
            // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            // тут можно записывать изменнённые ячейки в массив для валидации (!!!)
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
    }

    public addHandler({ sender }) {
        sender.addRow(this.createFormGroup(this.schema, new Product()));
    }

    public cancelHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
    }

    public saveHandler({ sender, formGroup, rowIndex }) {
        if (formGroup.valid) {
            this.editService.create(formGroup.value);
            sender.closeRow(rowIndex);
        }
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);
        sender.cancelCell();
    }  

    public saveChanges(grid: any): void {
        grid.closeCell();
        grid.cancelCell();
        this.editService.saveChanges();
    }

    public cancelChanges(grid: any): void {
        grid.cancelCell();
        this.editService.cancelChanges();
    }

    public validate(grid: any) {
        this.validationService.validate(grid);
        console.log('here must be validation');
    }

    public oldCreateFormGroup(dataItem: any): FormGroup {
        
        return this.formBuilder.group({
            'ProductID': dataItem.ProductID,
            'ProductName': [dataItem.ProductName, Validators.required],
            'UnitPrice': [dataItem.UnitPrice, Validators.min(0)],
            'UnitsInStock': [dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])],
            'Discontinued': dataItem.Discontinued
        });
    }

    private validatorsMapping(field: Field) {
        const schemaValidators = field.validatiors;
        
        let angularValidators: any[] = [];

        for (const validator in schemaValidators) {
            if (validator !== undefined) {
                switch (validator) {
                    case 'max': {
                        // console.log(schemaValidators['max']);
                        // console.log('max');
                        angularValidators.push(Validators.max(schemaValidators.max));
                        break;
                    }
                    case 'min': {
                        // console.log(schemaValidators['min']);
                        // console.log('min');
                        angularValidators.push(Validators.min(schemaValidators.min));
                        break;
                    }
                    case 'required': {
                        // console.log('required');
                        if (schemaValidators.required) {
                            angularValidators.push(Validators.required);
                        }
                        break;
                    }
                    default: { 
                        console.log('default');
                        break; 
                     } 
                }
            }
        }
        return angularValidators;
        // console.log('angular.validators: ' + angularValidators);
    }

    public createFormGroup(schema: ProductSchema, currentData): FormGroup {

        let formGroup: FormGroup = new FormGroup({});

        for (const field of schema.fields) {
            if (!(Object.keys(field.validatiors).length === 0 && field.validatiors.constructor === Object)) {

            }
            const control = new FormControl(currentData[field.name], Validators.compose(this.validatorsMapping(field)));
            formGroup.addControl(field.name, control);
        }

        return formGroup;
    }

}

