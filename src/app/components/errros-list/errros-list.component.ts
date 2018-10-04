import { Component, Input, OnInit } from '@angular/core';
import { ValidationError } from '../../validation';

@Component({
  selector: 'app-errros-list',
  templateUrl: './errros-list.component.html',
  styleUrls: ['./errros-list.component.css']
})
export class ErrrosListComponent implements OnInit {

  @Input() public validationErrors: ValidationError[];
  @Input() public numberErrorsToTake: number;

  public displayedErrors: ValidationError[] = [];

  ngOnInit(): void {
    if (this.numberErrorsToTake > this.validationErrors.length) {
      this.numberErrorsToTake = this.validationErrors.length;
    }

    this.displayedErrors = this.validationErrors.slice(0, this.numberErrorsToTake);
  }
}
