
export interface PaymentInterface {
    createSuscription(result: any,userUuid: string): Promise<any>;
}