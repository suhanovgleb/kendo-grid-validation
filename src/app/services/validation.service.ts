import { Injectable } from '@angular/core';
import { EditService } from './edit.service';
import { Schema, ProductSchema } from '../schema';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private editService: EditService) { }


  schema = new ProductSchema();

  public validate() {
    const updatedItems = this.editService.updatedItems;
    const createdItems = this.editService.createdItems;
    const allChangedItems = updatedItems.concat(createdItems);

    for (const item of allChangedItems) {
      let test = this.schema.fields.filter(r => 'r');
    }
  }
}

class Required {
  constructor(cell) {

  }
}

class Max {
  constructor(cell) {

  }
}
