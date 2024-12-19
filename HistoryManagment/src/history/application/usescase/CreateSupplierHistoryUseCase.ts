import { response } from "express";
import { HistoryInterface } from "../../domain/repositories/HistoryInterface";
import { ProducerHistoryCustomer } from "../../infrastructure/services/rabbitmq/producer/RabbitHistoryCustomerProducer";

export class CreateSupplierHistoryUseCase {
    constructor(private repository: HistoryInterface) {}

    async execute(supplierUuid: string): Promise<any> {
        const producer = new ProducerHistoryCustomer();

        try {
            await producer.setup();

            // Envía datos al proveedor RabbitMQ
            const responseuuid = await producer.send(supplierUuid);
            console.log(responseuuid);
            console.log('Respuesta del proveedor:', responseuuid.statusCode, responseuuid.message);
            console.log('UUID:', responseuuid.fullname);
            console.log('UUID:', supplierUuid);
            if (responseuuid.statusCode === 404) {
                return {
                    status: 404,
                    message: responseuuid.message
                };
            }

            // Consultar historial desde el repositorio
            const response: any = await this.repository.historySupplier(responseuuid.fullname, supplierUuid);
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
