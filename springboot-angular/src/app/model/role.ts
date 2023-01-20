import { Authority } from "./authority";

export class Role{
    name: string;
    authorities: Authority[];

    constructor() {
        this.name = '';
        this.authorities = [];
    }
}