import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { Page } from 'src/app/model/page';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { FileService } from 'src/app/service/file.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { saveAs } from 'file-saver';
import { UploadUserDetails } from 'src/app/model/upload-user-details';
import { NgForm } from '@angular/forms';

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
  public userIdToDelete: string;

  public userUploadResults: UploadUserDetails[] = [];

  constructor(private userService: UserService, private notificationService: NotificationService, private router: Router,
              private fileService: FileService) { }

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
            this.notificationService.sendNotification(NotificationType.SUCCESS, `User(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
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
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
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
  
  public onAddNewUser(form: NgForm): void{
    this.subscriptions.push(
      this.userService.createUserByAdmin(form.value).subscribe(
        (response: User) => {
          this.clickButton('new-user-close');
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.username}.`);
          
          this.resetForm(form);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  resetForm(form: NgForm): void {
    form.resetForm();
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.clickButton('openUserEdit');
  }

  public onDeleteUser(usedId: string): void {
    this.userIdToDelete = usedId;
    this.clickButton('openUserDeleteConfirmation');
  }

  public onUpdateUserClick(): void {
    this.clickButton('user-update');
  }

  public updateUser(user: User): void {
    this.subscriptions.push(
      this.userService.updateUserByAdmin(user).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
          this.notificationService.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public deleteUser(): void{
    this.subscriptions.push(
      this.userService.deleteUserByAdmin(this.userIdToDelete).subscribe(
        (response: CustomHttpResponse) => {
          this.getUsers(false, this.currentKeyword, this.currentPage, this.currentSize);
          this.notificationService.sendNotification(NotificationType.SUCCESS, response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public downloadTemplate() {
    this.fileService.downloadUserUploadTemplate().subscribe(
      {
        next: event => { 
          if(event.type === HttpEventType.Response) {
            saveAs(new File([event.body!], event.headers.get('File-Name')!, 
            {type: `${event.headers.get('Content-Type')};charset=utf-8`}));
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      }
    );
  }
  
  onUploadFiles(event: Event): void {
    console.log(event);
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
  
    this.fileService.uploadUsers(formData).subscribe(
      {
        next: (response: UploadUserDetails[]) => {
          this.userUploadResults = response;
          this.notificationService.sendNotification(NotificationType.SUCCESS, 'Users uploaded successfully.');
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotification(NotificationType.ERROR, 'Please upload CSV file.');
        }
      }
    );
  }

  clearUploadMessage() {
    this.userUploadResults = [];
  }
  
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
