
import { Injectable } from '@angular/core';
import { EditService } from './edit.service';
import { ISchema } from '../schemes/schema';
import { ValidationError } from '../validation';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private editService: EditService) { }

  public validate(schema: ISchema): ValidationError[] {

    let errors: ValidationError[] = [];

    const changedItems = this.editService
                             .updatedItems
                             .concat(this.editService.createdItems);

    for (const validator of schema.getValidators()) {
      // Not the best practice to compare ctor name with constant string, if we gonna use uglificators or so
      if (validator.constructor.name === 'UniqueConstraintsValidator') {
        errors = errors.concat(validator.Assert(this.editService.data, schema));
      } else {
        errors = errors.concat(validator.Assert(changedItems, schema));
      }
    }
    
    return errors;
  }

}
