
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { GridDataResult, GridComponent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './models/product';
import { EditService } from './services/edit.service';
import { ValidationService } from './services/validation.service';

import { map } from 'rxjs/operators/map';

import { ProductSchema } from './schemes/product-schema';
import { MarkupService } from './services/markup.service';
import { ValidationError } from './validation';


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

    @ViewChild(GridComponent) grid: GridComponent;

    public changes: any = {};
    private schema = new ProductSchema();

    private validationErrors: ValidationError[] = [];

    public ಠ_ಠ = 'ಠ_ಠ';    

    constructor(
        private editService: EditService,
        private validationService: ValidationService,
        private markupService: MarkupService,
        private elementRef: ElementRef,
        private renderer: Renderer2
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
        
        // tslint:disable-next-line:max-line-length
        const w = this.renderer.setStyle(this.elementRef.nativeElement.children[0].children[1].children[1].children[0].children[0].children[0].children[1].children[0].cells[0], 'backgroundColor', 'lightsalmon');
        const e = this.renderer.setStyle(this.elementRef.nativeElement.children[0].children[1]
            .children[1].children[0].children[0].children[0].children[1].children[2].cells[2], 'backgroundColor', 'lightsalmon');
        sender.addRow(this.createFormGroup(new Product()));
        
    }
    // nativeElement.children[""0""].children[1].children[1].children[""0""].children[""0""].children[""0""].children[1]

    public cancelHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
    }

    public saveHandler({ sender, formGroup, rowIndex }) {
        if (formGroup.valid) {
            this.editService.create(formGroup.value);
            sender.closeRow(rowIndex);
        }

        this.markupService.doMarkup(this.editService.data, this.validationErrors);
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);
        sender.cancelCell();
    }  

    public saveChanges(grid: any): void {
        grid.closeCell();
        grid.cancelCell();
        
        const datasets: object = {
            changedItems: this.editService.updatedItems.concat(this.editService.createdItems),
            allItems: this.editService.data
        };

        this.validationErrors = this.validationService.validate(this.schema, datasets);
        
        this.editService.saveChanges();
    }

    public cancelChanges(grid: any): void {
        grid.cancelCell();
        this.editService.cancelChanges();
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
            const validators = this.schema.getFieldFormValidators(field);
            const control = new FormControl(currentData[field.name]);
            formGroup.addControl(field.name, control);
        }
        return formGroup;
    }

}
