import { Role } from "./role";

export class User{
    public userId: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public email: string;
    public lastLoginDate: Date;
    public lastLoginToDisplay: Date;
    public joinDate: Date;
    public isActive: boolean;
    public isNotLocked: boolean;
    public roles: Role[];

    constructor() {
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.password = '';
        this.email = '';
        this.lastLoginDate = null;
        this.lastLoginToDisplay = null;
        this.joinDate = null;
        this.isActive = false;
        this.isNotLocked = false;
        this.roles = [];
    }
    
}