import { PaymentInterface } from "../../domain/repositories/paymentInterface";
import { PaymentModel } from "../models/MySQL/PaymentModel";

export class PaymentMySqlRepository implements PaymentInterface {
    async createSuscription(result: any, userUuid: string): Promise<any> {
        console.log('createSuscription:', result.id);
        const response = PaymentModel.create(
            {
                paymentId: result.id,
                userUuid: userUuid,
                amount: result.items[0].unit_price,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
        );

        if (!response) {
            throw new Error('Error al crear la suscripción');
        }

        return result;
    }
}