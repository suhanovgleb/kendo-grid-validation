import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnotationsDataService extends BehaviorSubject<any[]> {

  constructor() { super([]); }
}
