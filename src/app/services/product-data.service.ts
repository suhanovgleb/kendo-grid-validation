import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ProductType } from '../models/product';
import { EditService } from './edit.service';
import { NotificationCustomService } from './notification-custom.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService extends EditService {

  constructor(
    http: HttpClient,
    notificationService: NotificationCustomService) {
    super(http, notificationService);
  }

  public readProductTypes(): ProductType[] {
    return [
      new ProductType(1, 'Type 1'),
      new ProductType(2, 'Type 2'),
      new ProductType(3, 'Type 3'),
      new ProductType(4, 'Type 4')
    ];
  }

  
}
