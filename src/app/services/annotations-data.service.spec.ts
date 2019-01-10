import { TestBed } from '@angular/core/testing';

import { AnnotationsDataService } from './annotations-data.service';

describe('AnnotationsDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnotationsDataService = TestBed.get(AnnotationsDataService);
    expect(service).toBeTruthy();
  });
});
