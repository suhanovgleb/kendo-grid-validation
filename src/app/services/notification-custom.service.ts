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

  private baseSettings: NotificationSettings = {
    content: 'This is a basic notice. It should not be displayed in the user interface.',
    hideAfter: 2500,
    animation: { type: 'fade', duration: 500 },
    position: { horizontal: 'right', vertical: 'top' },
    type: { style: 'none', icon: true }
  };

  private show(passedSettings: NotificationSettings) {
    const ntfSettings = this.baseSettings;

    for (const setting in passedSettings) {
      if (passedSettings.hasOwnProperty(setting)) {
        ntfSettings[setting] = passedSettings[setting];
      }
    }

    this.notificationService.show(ntfSettings);
  }

  public successNotification(content: string) {
    const showContent: NotificationSettings = {
      content: content,
      type: { style: 'success', icon: true }
    };
    this.show(showContent);
  }

  public infoNotification(content: string) {
    const showContent: NotificationSettings = {
      content: content,
      type: { style: 'info', icon: true }
    };
    this.show(showContent);
  }

  public errorNotification(content: string) {
    const showContent: NotificationSettings = {
      content: content,
      type: { style: 'error', icon: true }
    };
    this.show(showContent);
  }
}
