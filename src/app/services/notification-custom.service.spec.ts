import { TestBed, inject } from '@angular/core/testing';

import { NotificationCustomService } from './notification-custom.service';

describe('NotificationCustomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationCustomService]
    });
  });

  it('should be created', inject([NotificationCustomService], (service: NotificationCustomService) => {
    expect(service).toBeTruthy();
  }));
});
