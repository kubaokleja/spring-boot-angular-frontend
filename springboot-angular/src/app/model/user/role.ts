import { Authority } from "./authority";

export class Role{
    id: number;
    name: string;
    authorities: Authority[];

    constructor() {
        this.name = '';
        this.authorities = [];
    }
}