import { v4 as uuidv4 } from 'uuid';

export class TotalTransaction {
    public _id: string;
    public userId: string;
    public year: number;
    public month: number;
    public totalIncome: number;
    public totalExpenses: number;
    public balance: number;

    constructor(
        userId: string,
        year: number,
        month: number,
        totalIncome: number = 0,
        totalExpenses: number = 0,
        balance: number = 0,
    ) {
        this._id = uuidv4();
        this.userId = userId;
        this.year = year;
        this.month = month;
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.balance = balance;
    }

    addIncome(amount: number): void {
        if (amount < 0) throw new Error("El ingreso no puede ser negativo");
        this.totalIncome += amount;
        this.balance = this.getMonthlyBalance();
    }

    addExpense(amount: number): void {
        if (amount < 0) throw new Error("El gasto no puede ser negativo");
        this.totalExpenses += amount;
        this.balance = this.getMonthlyBalance();
    }

    getMonthlyBalance(): number {
        return this.totalIncome - this.totalExpenses;
    }
}
