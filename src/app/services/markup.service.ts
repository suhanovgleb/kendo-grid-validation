import { Injectable } from '@angular/core';
import { ValidationError } from '../validation';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ColumnComponent } from '../../../node_modules/@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class MarkupService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public doMarkup(dataItem: any, columnInfo: ColumnComponent, validationErrors: ValidationError[]): SafeStyle {
    const result = '#FFBA80';

    for (const error of validationErrors) {
      if (dataItem === error.item) {
        // console.log('hooray!', columnInfo.title, error.item.ProductID);
        for (const fieldName of error.fieldNames) {
          if (columnInfo.field === fieldName) {
            return this.sanitizer.bypassSecurityTrustStyle(result);
          }
        }
      }
    }

    // if ((dataItem.ProductName === '1') && (columnInfo.field === 'ProductName')) {
    //   return this.sanitizer.bypassSecurityTrustStyle(result);
    // }
  }
}
