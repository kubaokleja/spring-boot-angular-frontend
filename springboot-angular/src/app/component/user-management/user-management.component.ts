import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { Page } from 'src/app/model/page';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public userPage: Page;
  public selectedUser: User;
  public currentKeyword: string;
  public currentPage: number;
  public currentSize: number;
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  public editUser: User = new User();

  constructor(private userService: UserService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.getUsers(true);
  }

  public isAdmin(user: User): boolean{
    return user.roles?.map(role => role.name).find(role => role == "ROLE_ADMIN")?.length > 0;
  }

  public refreshUsers(): void
  {
    this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
  }
  
  public arrayToString(roles: Role[]): string {
      if(roles === null){
        return "";
      }
      return roles.map(role => role.name.substring(5)).join(', ');
  }

  public getUsers(showNotification: boolean, keyword: string = '', page: number = 0, size: number = 10): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers(keyword, page, size).subscribe(
        (response: Page) => {
          this.userPage = response;
          this.refreshing = false;
          this.currentKeyword = keyword;
          if(response.number > 0 && response.numberOfElements == 0) {
            this.currentPage--;
            this.gotToPage(keyword, this.currentPage);
          } else {
            this.currentPage = page;
          }
          this.currentSize = size;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `User(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          this.router.navigateByUrl('/');
        }
      )
    );
  }

  public gotToPage(keyword?: string, pageNumber: number = 0): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers(keyword, pageNumber, this.currentSize).subscribe(
        (response: Page) => {
          this.userPage = response;
          this.refreshing = false;
          this.currentKeyword = keyword;
          this.currentPage = pageNumber;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.gotToPage(name, direction === 'forward' ? this.currentPage + 1 : this.currentPage - 1);
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }
  
  public onAddNewUser(user: User): void{
    this.subscriptions.push(
      this.userService.createUserByAdmin(user).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
          this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.username}.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.clickButton('openUserEdit');
  }

  public onUpdateUserClick(): void {
    this.clickButton('user-update');
  }

  public onUpdateUser(user: User): void {
    this.subscriptions.push(
      this.userService.updateUserByAdmin(user).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public onDeleteUser(userId: string): void{
    this.subscriptions.push(
      this.userService.deleteUserByAdmin(userId).subscribe(
        (response: CustomHttpResponse) => {
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
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
