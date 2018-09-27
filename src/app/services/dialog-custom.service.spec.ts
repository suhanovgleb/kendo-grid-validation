import { TestBed, inject } from '@angular/core/testing';

import { DialogCustomService } from './dialog-custom.service';

describe('DialogCustomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogCustomService]
    });
  });

  it('should be created', inject([DialogCustomService], (service: DialogCustomService) => {
    expect(service).toBeTruthy();
  }));
});
