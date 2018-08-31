import { Injectable } from '@angular/core';
import { ValidationError } from '../validation';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MarkupService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public doMarkup(dataItem) {
    let result;

    
      result = 'black';
    

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }
}
