import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public user: User = new User();
  public userId: string;
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService, private notificationService: NotificationService, private route: ActivatedRoute,
             private router: Router, private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId'); 
    this.getUserById(this.userId);
  }

  getUserById(userId: string): void {
    this.subscriptions.push(
      this.userService.getUserById(userId).subscribe(
        (response: User) => {
          this.user = response;
          this.sendNotification(NotificationType.SUCCESS, `User loaded successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.router.navigateByUrl('/');
        }
      )
    );
  }
  
  onUpdateCurrentUser(user: User): void {
    this.subscriptions.push(
      this.userService.updateUser(user, this.userId).subscribe(
        (response: User) => {
          this.user = response;
          this.sendNotification(NotificationType.SUCCESS, `User updated successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
 
  onDeleteUser(): void {
    this.clickButton('openUserDeleteConfirmation');
  }
 
  onChangePassword(): void {
    this.clickButton('openUserPasswordChange');
  }

  changePassword(form: NgForm): void {
    const password = form.value.password;
    this.resetForm(form);
  }
  
  resetForm(form: NgForm): void {
    form.resetForm();
  }
  
  deleteAccount(): void {
    this.subscriptions.push(
      this.userService.deleteUser(this.userId).subscribe(
        (response: CustomHttpResponse) => {
          this.authenticationService.logOut();
          this.router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
          this.sendNotification(NotificationType.SUCCESS, response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
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
  
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
