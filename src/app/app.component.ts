import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './services/edit.service';
import { ValidationService } from './services/validation.service';

import { map } from 'rxjs/operators/map';

import { ProductSchema, ProductValidators } from './schema';


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
        take: 10
    };

    public changes: any = {};
    public schema = new ProductSchema();

    public ಠ_ಠ = '୧((#Φ益Φ#))୨';    

    constructor(
        public editService: EditService,
        private validationService: ValidationService
    ) {
        console.log(this.ಠ_ಠ);
    }
    
    public ngOnInit(): void {
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
        this.editService.read();

        // this.validationService.validate(this.schema);
        // let temp = new ValidationService();
        // temp.Register(this.customValidator) 

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
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);
        sender.cancelCell();
    }  

    public saveChanges(grid: any): void {
        grid.closeCell();
        grid.cancelCell();
        
        this.validationService.validate(this.schema);
        
        this.editService.saveChanges();
    }

    public cancelChanges(grid: any): void {
        grid.cancelCell();
        this.editService.cancelChanges();
    }

    // MAIN FORM GROUP CREATOR WITH IN-FORM VALIDATION
    public MAINcreateFormGroup(currentData): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        for (const field of this.schema.fields) {
            const validators = this.schema.getFormValidators(field);
            const control = new FormControl(currentData[field.name], Validators.compose(validators));
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

    // WITHOUT FORM VALIDATION, USE ONLY FOR VALIDATION SERVICE TESTING
    public createFormGroup(currentData): FormGroup {
        const formGroup: FormGroup = new FormGroup({});

        for (const field of this.schema.fields) {
            const validators = this.schema.getFormValidators(field);
            const control = new FormControl(currentData[field.name]);
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

    // public customValidatorCol2_3() {

    // }
}
