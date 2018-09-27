import { Component, Input, OnInit } from '@angular/core';
import { ValidationError } from '../../validation';

@Component({
  selector: 'app-errros-list',
  templateUrl: './errros-list.component.html',
  styleUrls: ['./errros-list.component.css']
})
export class ErrrosListComponent implements OnInit {

  @Input() public validationErrors: ValidationError[];
  @Input() public displayItems: number;

  ngOnInit(): void {
    if (this.displayItems > this.validationErrors.length) {
      this.displayItems = this.validationErrors.length;
    }
  }

}
