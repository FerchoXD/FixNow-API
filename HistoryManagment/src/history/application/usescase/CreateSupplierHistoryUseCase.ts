import { response } from "express";
import { HistoryInterface } from "../../domain/repositories/HistoryInterface";
import { ProducerHistory } from "../../infrastructure/services/rabbitmq/producer/RabbitHistoryProducer";

export class CreateSupplierHistoryUseCase {
    constructor(private repository: HistoryInterface) {}

    async execute(userUuid: string): Promise<any> {
        const producer = new ProducerHistory();

        try {
            await producer.setup();

            // Envía datos al proveedor RabbitMQ
            const responseuuid = await producer.send(userUuid);

            console.log('Respuesta del proveedor:', responseuuid.statusCode, responseuuid.message);

            if (responseuuid.statusCode === 404) {
                return {
                    status: 404,
                    message: responseuuid.message
                };
            }

            // Consultar historial desde el repositorio
            const response = await this.repository.historySupplier(responseuuid.fullname, userUuid);
            console.log('Historial creado y mensaje enviado.', response);

            return response;
        } catch (error) {
            console.error('Error en CreateSupplierHistoryUseCase:', error);
            throw new Error('No se pudo completar la operación.');
        } finally {
            await producer.close();
        }
    }
}
