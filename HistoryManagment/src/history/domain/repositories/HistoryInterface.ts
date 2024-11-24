
export interface HistoryInterface {
    create(userUuid:string,title: string, description: string, agreedPrice:number, agreedDate:Date): Promise<any>;
    historySupplier(fullname: string, userUuid:string): Promise<void>;
}