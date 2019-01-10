import { TestBed } from '@angular/core/testing';

import { AnnotationDataService } from './annotation-data.service';

describe('AnnotationDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnotationDataService = TestBed.get(AnnotationDataService);
    expect(service).toBeTruthy();
  });
});
