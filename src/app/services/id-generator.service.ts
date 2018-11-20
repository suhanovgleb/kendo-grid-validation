import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {
  private freeId = -1;
  getId(): number { return this.freeId--; }
  reset(): void { this.freeId = -1; }
}
