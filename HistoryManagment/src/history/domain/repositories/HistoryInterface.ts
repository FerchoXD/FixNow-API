
export interface HistoryInterface {
    create(customerUuid:string,supplierUuid:string,title: string, description: string, agreedPrice:number, agreedDate:Date): Promise<any>;
    historySupplier(fullname: string, supplierUuid:string): Promise<void>;
    historyCustomer(fullname: string, customerUuid:string): Promise<void>;
}