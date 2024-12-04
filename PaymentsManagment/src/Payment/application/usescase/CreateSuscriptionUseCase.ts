import { PaymentInterface } from "../../domain/repositories/paymentInterface";
import { ServiceMercadoPago } from "../../infrastructure/services/Mercado Pago/MercadoPagoProvider";
import { RabbitPaymentProducer } from "../../infrastructure/services/rabbitmq/producer/RabbitPaymentProducer";

export class CreateSuscriptionUseCase{
    constructor(private repository: PaymentInterface) {}
    async execute(userUuid: string): Promise<any> {

        const producer = new RabbitPaymentProducer();
        const paymentData = new ServiceMercadoPago();

        await producer.setup();
        
        const data = await producer.send(userUuid);

        const dataPayment = await paymentData.chekout(data);

        if (!dataPayment) {
            throw new Error('Error al crear la suscripción');
        }
        
        return await this.repository.createSuscription(dataPayment, userUuid);
    }
}