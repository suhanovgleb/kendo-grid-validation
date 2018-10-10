import { Component, Input, OnInit } from '@angular/core';
import { ValidationError } from '../../validation';
import { IErrorListComponent } from './interface-errors-list-component';


@Component({
  selector: 'app-errros-list',
  templateUrl: './errros-list.component.html',
  styleUrls: ['./errros-list.component.css']
})

export class ErrrosListComponent implements OnInit, IErrorListComponent {

  // All gird errors
  @Input() public validationErrors: ValidationError[];
  // The number of errors that will be displayed in detail
  @Input() public numberErrorsToDisplay;
  // Errors that will be displayed in detail
  public displayedErrors: ValidationError[] = [];

  ngOnInit(): void {
    if (this.numberErrorsToDisplay > this.validationErrors.length) {
      this.numberErrorsToDisplay = this.validationErrors.length;
    }

    this.displayedErrors = this.validationErrors.slice(0, this.numberErrorsToDisplay);
  }
}
