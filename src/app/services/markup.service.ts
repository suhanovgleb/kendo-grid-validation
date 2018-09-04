import { Injectable } from '@angular/core';
import { ValidationError } from '../validation';
import { DomSanitizer } from '@angular/platform-browser';
import { ColumnComponent } from '../../../node_modules/@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class MarkupService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public doMarkup(dataItem: any, columnInfo: ColumnComponent, validationErrors: ValidationError[]) {
    const result = '#FFBA80';

    if ((dataItem.ProductName === '1') && (columnInfo.field === 'ProductName')) {
      return this.sanitizer.bypassSecurityTrustStyle(result);
    }
  }
}
