import { Injectable } from '@angular/core';
import { ValidationError } from '../validation';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ColumnComponent } from '../../../node_modules/@progress/kendo-angular-grid';
import { ISchema } from '../schemes/schema';

const isEquivalent = (obj1, obj2) => {
  if (typeof (obj1) === 'object' || typeof (obj2) === 'object') {
    // Create arrays of property names
    const obj1Props = Object.getOwnPropertyNames(obj1);
    const obj2Props = Object.getOwnPropertyNames(obj2);
    // If number of properties is different,
    // objects are not equivalent
    if (obj1Props.length !== obj2Props.length) {
      return false;
    }
    for (let i = 0; i < obj1Props.length; i++) {
      const propName = obj1Props[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (obj1[propName] !== obj2[propName]) {
        return false;
      }
    }
  } else {
    if (obj1 !== obj2) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
};

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

    let rootFieldName: string = columnInfo.field;
    if (rootFieldName.includes('.')) {
      rootFieldName = rootFieldName.split('.', 1)[0];
    }

    for (const error of validationErrors) {
      if (dataItem[schema.idField] === error.item[schema.idField]) {
        for (const fieldName of error.fieldNames) {
          if (rootFieldName === fieldName && isEquivalent(error.item[fieldName], dataItem[fieldName])) {
            return this.sanitizer.bypassSecurityTrustStyle(errorBgColor);
          }
        }
      }
    }
  }
}
