import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public validate(grid: any) {
    console.log('here we go');
    console.table(grid.data);
  }
}
