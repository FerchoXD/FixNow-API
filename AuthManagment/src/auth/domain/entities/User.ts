import { v4 as uuidv4 } from 'uuid';
import { Contact } from "./Contact";
import { Status } from "./Status";
import { Credential } from "./Credential";
import { UserProfile } from './UserProfile';

export class User {
    public uuid: string;
    public googleId: string;
    public fullname: string; 
    public tokenfcm: string;
    public contact: Contact;
    public credential: Credential;
    public status: Status;
    public userProfile: UserProfile;

    constructor(
        contact: Contact, 
        credential: Credential, 
        status: Status, 
        userProfile: UserProfile, 
        googleId: string,
        tokenfcm: string,
        fullname: string ) {

        this.uuid = uuidv4();
        this.googleId = googleId;
        this.fullname = fullname;
        this.tokenfcm = tokenfcm;
        this.contact = contact;
        this.credential = credential;
        this.status = status;
        this.userProfile = userProfile;
    }
}
