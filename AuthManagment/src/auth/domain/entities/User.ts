import { v4 as uuidv4 } from 'uuid';
import { Contact } from "./Contact";
import { Status } from "./Status";
import { Credential } from "./Credential";
import { UserProfile } from './UserProfile';

export class User {
    public uuid: string;
    public contact: Contact;
    public credential: Credential;
    public status: Status;
    public userProfile: UserProfile;

    constructor(contact: Contact, credential: Credential, status: Status, userProfile: UserProfile) {
        this.uuid = uuidv4();
        this.contact = contact;
        this.credential = credential;
        this.status = status;
        this.userProfile = userProfile;
    }
}
