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

  // private baseSettings: NotificationSettings = {
  //   content: 'This is base notification',
  //   hideAfter: 2500,
  //   animation: { type: 'fade', duration: 500 },
  //   position: { horizontal: 'right', vertical: 'top' },
  //   type: { style: 'none', icon: true }
  // };

  public show(showContent: NotificationSettings) {
    this.notificationService.show(showContent);
  }

  public saveSuccessfullyNotification() {
    const showContent: NotificationSettings = {
      content: 'Saving data completed successfully.',
      hideAfter: 2500,
      animation: { type: 'fade', duration: 500 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true }
    };
    this.show(showContent);
  }

  public cancelChangesNotification() {
    const showContent: NotificationSettings = {
      content: 'Changed data has been reset.',
      hideAfter: 2500,
      animation: { type: 'fade', duration: 500 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'info', icon: true }
    };
    this.show(showContent);
  }

  public savePreventedNotification() {
    const showContent: NotificationSettings = {
      content: 'There are some errors. Saving is not possible.',
      hideAfter: 2500,
      animation: { type: 'fade', duration: 500 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'error', icon: true }
    };
    this.show(showContent);
  }
}
