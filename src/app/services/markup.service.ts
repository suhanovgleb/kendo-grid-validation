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
      if (dataItem.ProductID === error.item.ProductID) {
        for (const fieldName of error.fieldNames) {
          if (columnInfo.field === fieldName) {
            if (error.item[fieldName] === dataItem[fieldName]) {
              return this.sanitizer.bypassSecurityTrustStyle(result);
            }
          }
        }
      }
    }

    // if ((dataItem.ProductName === '1') && (columnInfo.field === 'ProductName')) {
    //   return this.sanitizer.bypassSecurityTrustStyle(result);
    // }
  }

  // public getMap(data: any, columnInfo: ColumnComponent, validationErrors: ValidationError[]): SafeStyle {

  //   const markupMap: any = {};

  //   const result = '#FFBA80';
  //   for (const dataItem of data) {
  //     if (dataItem.UnitPrice === -4) {
  //       console.log('lookAtMe!');
  //     }

  //     for (const error of validationErrors) {
  //       if (dataItem === error.item) {
  //         // console.log('hooray!', columnInfo.title, error.item.ProductID);
  //         for (const fieldName of error.fieldNames) {
  //           if (columnInfo.field === fieldName) {
              
  //             // return this.sanitizer.bypassSecurityTrustStyle(result);
  //           }
  //         }
  //       }
  //     }
  //   }

    // if ((dataItem.ProductName === '1') && (columnInfo.field === 'ProductName')) {
    //   return this.sanitizer.bypassSecurityTrustStyle(result);
    // }
  }

  // getMarkupMap(validationErrors: ValidationError[]) {
  //   const markupMap: any = {};

  //   for (const error of validationErrors) {
  //     for (const field of error.fieldNames) {
  //       error.item.P
  //       markupMap.field.push({
          
  //       });
  //     }
  //   }
  // }

  // public doMarkup(dataItem, columnInfo, markupMap) {
  //   for (const color in markupMap) {
  //         if (dataItem.ProductID % markupMap[color] === 0) {
  //           // console.log('hooray!', columnInfo.title, error.item.ProductID);
            
              
  //               return this.sanitizer.bypassSecurityTrustStyle(color);
              
            
  //         }
  //       }
  // }
// }

