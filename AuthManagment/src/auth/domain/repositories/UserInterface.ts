import { User } from "../entities/User";

export interface UserInterface {
    save(user: User): Promise<User|any>;
    update(token:string): Promise<User|any>;
    login(email:string, password:string):Promise<User|any>;
    logout(email:string):Promise<any|void>;
    profileData(uuid: any, profileData:any,imageUrls: string[], calendar: any[]):Promise<User|any>;
    updateUserImages(uuid: string, images: string[]): Promise<any>;
    getServices(uuid:string):Promise<User|any>;
    findProfileById(uuid: string):Promise<User|any>;
    getFilters(data:any):Promise<User|any>;
    authenticateWithGoogle(googleId: string, name: string, email: string, profileUrl: string): Promise<User>;
    findByGoogleId(googleId: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    rabbitHistorySupplier(uuid: string): Promise<any>;
    rabbitHistoryCustomer(uuid: string): Promise<any>;
    findRelevantSuppliers(keyPhrases:string[]): Promise<User[]>;
    //getData(): Promise<User>;
    rabbitPayment(data: any): Promise<void>;
    rabbitRaiting(data: any, polarity:any): Promise<void>;
    getAllSuppliers(validField:String): Promise<User[] | { status: number; message: string}>;
    saveTokenFcm(userUuid: string, token: string): Promise<any>;
}