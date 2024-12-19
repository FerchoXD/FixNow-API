import { ServiceNotification } from "../services/ServiceNotification";

export class RabbitConsumerNotificationUseCase {
    constructor() { }

    async execute(tokenfcm: string, title: string, body: string,type:string, serviceId:string): Promise<any> {
        try {

            const service = new ServiceNotification();
            console.log('Ejecutando RabbitConsumerNotificationUseCase');
            // Simula el envío de notificación (Reemplazar con lógica real)
            if (!tokenfcm || !title || !body|| !type|| !serviceId) {
                throw new Error('Los parámetros para enviar la notificación no son válidos.');
            }
            
            const response = await service.sendNotification(tokenfcm, title, body,type, serviceId);
            console.log('Respuesta de RabbitConsumerNotificationUseCase:', response);
            if(response.status === 'success'){
                return { success: true };
            }
        } catch (error) {
            console.error('Error en RabbitConsumerNotificationUseCase.execute:', error);
            throw new Error('Error al consumir mensaje de RabbitMQ.');
        }
    }
}
