import { TestBed } from '@angular/core/testing';

import { EditBaseService } from './edit-base.service';

describe('EditBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditBaseService = TestBed.get(EditBaseService);
    expect(service).toBeTruthy();
  });
});
