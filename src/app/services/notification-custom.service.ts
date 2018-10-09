import { Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NotificationSettings } from '@progress/kendo-angular-notification/dist/es2015/models/notification-settings';

@Injectable({
  providedIn: 'root'
})
export class NotificationCustomService {

  constructor(
    private notificationService: NotificationService
  ) { }

  public show(showContent: NotificationSettings) {
    this.notificationService.show(showContent);
  }

  public saveSuccessfully() {
    const showContent: NotificationSettings = {
      content: 'Saving data completed successfully.',
      hideAfter: 2500,
      animation: { type: 'fade', duration: 500 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true }
    };
    this.show(showContent);
  }
}
