import { Injectable } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ValidationError } from '../validation';

import { ErrrosListComponent } from '../components/errros-list/errros-list.component';
import { ISchema } from '../schemes/schema';
import { IErrorListComponent } from '../components/errros-list/interface-errors-list-component';

@Injectable({
  providedIn: 'root'
})
export class DialogCustomService {

  constructor(
    private dialogService: DialogService
  ) { }

  showDialog(title?: string, content?: string): DialogRef {
    return this.dialogService.open({
      title: title,
      content: content,
      width: 450,
      height: 200,
      minWidth: 250
    });
  }

  public showErrorsCount(validationErrors: ValidationError[]) {
    let content: string;
        if (validationErrors.length) {
            content = 'There ' 
                + (validationErrors.length === 1 ? 'is ' : 'are ') 
                + validationErrors.length 
                + (validationErrors.length === 1 ? 'error ' : ' errors ') 
                + 'left.';
        } else {
            return;
        }
        this.showDialog('Error list', content);
  }

  public showErrorsList(validationErrors: ValidationError[], schema: ISchema, numberErrorsToDisplay: number = 5) {
    if (validationErrors.length) {
      const dialogRef: DialogRef = this.dialogService.open({
        title: 'Error list',
        content: ErrrosListComponent,
        actions: [
          { text: 'OK' }
        ]
      });

      const errorsInfo: IErrorListComponent = dialogRef.content.instance;
      
      errorsInfo.validationErrors = validationErrors;
      errorsInfo.numberErrorsToDisplay = numberErrorsToDisplay;
    } else {
      return;
    }
  }
}
