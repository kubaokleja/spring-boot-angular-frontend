import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) { }

  public notify(type: NotificationType, message: string): void{
    this.notifier.notify(type, message);
  }

  public sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notify(notificationType, message);
    } else {
      this.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
}
