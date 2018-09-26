import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {
  private freeId = -1;
  getId() { return this.freeId--; }
  reset() { this.freeId = -1; }
}
