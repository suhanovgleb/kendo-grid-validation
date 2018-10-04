import { Injectable } from '@angular/core';
import { ValidationError } from '../validation';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ColumnComponent } from '../../../node_modules/@progress/kendo-angular-grid';
import { ISchema } from '../schemes/schema';

@Injectable({
  providedIn: 'root'
})
export class MarkupService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  // Changes the background color of cells with errors
  public doMarkup(dataItem: any, columnInfo: ColumnComponent, validationErrors: ValidationError[], schema: ISchema): SafeStyle {

    const errorBgColor = '#FFBA80';
    
    for (const error of validationErrors) {
      if (dataItem[schema.idField] === error.item[schema.idField]) {
        for (const fieldName of error.fieldNames) {
          if (columnInfo.field === fieldName && error.item[fieldName] === dataItem[fieldName]) {
              return this.sanitizer.bypassSecurityTrustStyle(errorBgColor);
          }
        }
      }
    }
  }
}
