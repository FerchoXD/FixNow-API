import { v4 as uuidv4 } from 'uuid';

export class Transaction {
    public _id: string;
    public type: 'income' | 'expense';
    public userId: string;
    public amount: number;
    public date: Date;
    public category: string;
    public description: string;
    public state: 'progress' | 'completed' | 'canceled';

    constructor(
        type: 'income' | 'expense',
        userId: string,
        amount: number,
        date: Date,
        category: string,
        description: string,
        state: 'progress' | 'completed' | 'canceled',
    ) {
        this._id = uuidv4();
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.userId = userId;
        this.description = description;
        this.state = state;
    }


}
