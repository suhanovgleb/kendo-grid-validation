import { Injectable } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ValidationError } from '../validation';

import { ErrrosListComponent } from '../components/errros-list/errros-list.component';
import { ISchema } from '../schemes/schema';

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
        this.showDialog('Error!', content);
  }

  public showErrorsList(validationErrors: ValidationError[], schema: ISchema, numberErrorsToTake: number = 5) {
    if (validationErrors.length) {
      const dialogRef = this.dialogService.open({
        title: 'Error!',
        content: ErrrosListComponent,
        actions: [
          { text: 'OK' }
        ]
      });

      const errorsInfo = dialogRef.content.instance;
      errorsInfo.validationErrors = validationErrors;
      errorsInfo.numberErrorsToTake = numberErrorsToTake;
    } else {
      return;
    }
  }
}
