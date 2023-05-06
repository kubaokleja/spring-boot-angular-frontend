import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from './enum/notification-type.enum';
import { Role } from './model/user/role';
import { User } from './model/user/user';
import { AuthenticationService } from './service/authentication.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'springboot-angular';

  isUserLoggedIn: boolean;
  loggedInUsername: string = '';
  loggedUser: User;

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private notificationService: NotificationService){}

  ngOnInit(): void {
    this.loggedUser = this.authenticationService.getUserFromLocalCache();
    this.isUserLoggedIn = this.authenticationService.isUserLoggedIn();
    this.loggedInUsername = this.authenticationService.getLoggedInUsername();
  }

  public logout(): void {
    this.authenticationService.logOut();
    this.router.navigateByUrl('/')
    this.ngOnInit();
    this.notificationService.sendNotification(NotificationType.SUCCESS, `You have been logged out successfully`);
  }

  public get isAdmin(): boolean {
    return this.getUserRoles()?.map(role => role.name).find(role => role == "ROLE_ADMIN")?.length > 0;
  }

  private getUserRoles(): Role[] {
    return this.authenticationService.getUserFromLocalCache()?.roles;
  }

}
