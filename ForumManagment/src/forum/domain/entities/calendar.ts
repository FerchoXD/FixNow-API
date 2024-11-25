import { v4 as uuidv4 } from 'uuid';
import { IsNotEmpty, IsNumber  } from 'class-validator';

enum CalendarStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

export class Calendar {

    uuid: string;
    userUuid: string;
    @IsNotEmpty({ message: 'Title should not be empty' })
    title: string;
    description: string;
    @IsNotEmpty({ message: 'Price should not be empty' })
    @IsNumber({}, { message: 'Price should be a number' })
    agreedPrice: number;
    agreedDate: Date;
    status: CalendarStatus;


    constructor(
        userUuid: string,
        title: string,
        description: string,
        agreedPrice: number,
        agreedDate: Date,
    ) {
        this.uuid = uuidv4();
        this.userUuid = userUuid;
        this.title = title;
        this.description = description;
        this.agreedPrice = agreedPrice;
        this.agreedDate = agreedDate;
        this.status = CalendarStatus.PENDING;
    }
}
