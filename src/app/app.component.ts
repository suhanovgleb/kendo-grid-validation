import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from './model';
import { EditService } from './services/edit.service';
import { ValidationService } from './services/validation.service';

import { map } from 'rxjs/operators/map';

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

    constructor(
        private formBuilder: FormBuilder,
        public editService: EditService,
        private validationService: ValidationService
    ) {
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
            // тут можно записывать изменнённые ячейки в массив для валидации (!!!)
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

    public createFormGroup(dataItem: any): FormGroup {
        return this.formBuilder.group({
            'ProductID': dataItem.ProductID,
            'ProductName': [dataItem.ProductName, Validators.required],
            'UnitPrice': [dataItem.UnitPrice, Validators.min(0)],
            'UnitsInStock': [dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])],
            'Discontinued': dataItem.Discontinued
        });
    }
}
