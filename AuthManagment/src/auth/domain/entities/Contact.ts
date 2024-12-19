import { v4 as uuidv4 } from 'uuid';
import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class Contact {
    uuid: string;

    @IsNotEmpty({ message: 'First name should not be empty' })
    firstname: string;

    @IsNotEmpty({ message: 'Last name should not be empty' })
    lastname: string;

    fullname: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsNotEmpty({ message: 'Phone number should not be empty' })
    phone: string;

    @IsIn(['CUSTOMER', 'SUPPLIER'], { message: 'Role must be either "suplier" or "client"' })
    role: 'CUSTOMER' | 'SUPPLIER';

    constructor(
        firstname: string,
        lastname: string,
        fullname: string,
        email: string,
        phone: string,
        role: 'CUSTOMER' | 'SUPPLIER'
    ) {
        this.uuid = uuidv4();
        this.firstname = firstname;
        this.lastname = lastname;
        this.fullname = firstname + ' ' + lastname;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }
}
