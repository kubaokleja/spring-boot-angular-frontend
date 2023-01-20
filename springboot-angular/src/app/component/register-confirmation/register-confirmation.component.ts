import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.css']
})
export class RegisterConfirmationComponent implements OnInit, OnDestroy {

  
  private subscriptions: Subscription[] = [];
  private token: string; 


  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
                private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.confirmRegistration();
  }

  confirmRegistration(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.subscriptions.push(
      this.userService.confirmRegistration(this.token).subscribe(
        (response: string) => {
          this.sendNotification(NotificationType.SUCCESS, response);
          this.router.navigateByUrl('/login');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.router.navigateByUrl('/');
        }
      )
    );    
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
