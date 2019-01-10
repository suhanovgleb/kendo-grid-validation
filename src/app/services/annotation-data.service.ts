import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EditService } from './edit.service';
import { NotificationCustomService } from './notification-custom.service';

@Injectable({
  providedIn: 'root'
})
export class AnnotationDataService extends EditService {

  constructor(
    http: HttpClient,
    notificationService: NotificationCustomService) {
    super(http, notificationService);
  }

  
}
