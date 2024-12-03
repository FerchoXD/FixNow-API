import { response } from "express";
import { HistoryInterface } from "../../domain/repositories/HistoryInterface";
import { ProducerHistorySupplier } from "../../infrastructure/services/rabbitmq/producer/RabbitHistorySupplierProducer";

export class CreateCustomerHistoryUseCase {
    constructor(private repository: HistoryInterface) {}

    async execute(customerUuid: string): Promise<any> {
        const producer = new ProducerHistorySupplier();

        try {
            await producer.setup();

            const responseuuid = await producer.send(customerUuid);
            console.log(responseuuid);

            
            if (responseuuid.statusCode === 404) {
                return {
                    status: 404,
                    message: responseuuid.message
                };
            }

            // Consultar historial desde el repositorio
            const response: any = await this.repository.historyCustomer(responseuuid.fullname, customerUuid);
            console.log('Historial creado y mensaje enviado.', response);

            if (response.status === 404) {
                return {
                    status: 404,
                    message: response.message
                };
            }

            return response;
        } catch (error) {
            console.error('Error en CreateSupplierHistoryUseCase:', error);
            throw new Error('No se pudo completar la operación.');
        } finally {
            await producer.close();
        }
    }
}
