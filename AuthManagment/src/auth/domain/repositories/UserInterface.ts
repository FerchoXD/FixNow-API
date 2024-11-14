import { User } from "../entities/User";

export interface UserInterface {
    save(user: User): Promise<User|any>;
    update(token:string): Promise<User|any>;
    login(email:string, password:string):Promise<User|any>;
    logout(email:string):Promise<any|void>;
    profileData(uuid: any, profileData:any,imageUrls: string[]):Promise<User|any>;
    getServices(uuid:string):Promise<User|any>;
    findProfileById(uuid: string):Promise<User|any>;
    getFilters(data:any):Promise<User|any>;
}