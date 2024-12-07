import { HistoryInterface } from "../../domain/repositories/HistoryInterface";
import { ProducerSendNotification } from "../../infrastructure/services/rabbitmq/producer/ProducerSendNotification";
import { ProducerNotification } from "../../infrastructure/services/rabbitmq/producer/RabbitNotification";

export class CreateServiceHistoryUseCase {
    constructor(readonly repository: HistoryInterface) { }

    async execute(customerUuid:string,supplierUuid:string,title: string, description: string, agreedPrice:number, agreedDate:Date): Promise<any> {

        //iniciamos la conexion con el servidor de rabbitmq para auth
        const producerNotis = new ProducerNotification();
        await producerNotis.setup();
        console.log("se inicio la conexion con el servidor de rabbitmq para auth");
        
        console.log("pasando al repositorio de history");
        const response = await this.repository.create(customerUuid,supplierUuid,title, description, agreedPrice, agreedDate);
        console.log('respuesta del reposiotorio de history', response);

        if ( response.message === 'Cita creada con éxito.') {
            console.log("enviando notificacion al supplier", response.data.dataValues.supplierUuid);
            const responseuuid = await producerNotis.send(response.data.dataValues.supplierUuid);
            console.log('respuesta de producer que va a auth', responseuuid.tokenfcm);

            //en caso de no encontrar el token fcm del supplier
            if (responseuuid.statusCode === 404) {
                return {
                    status: 404,
                    message: responseuuid.message
                };

            }

            //iniciamos la conexion con el servidor de rabbitmq para notificaciones
            const producer = new ProducerSendNotification();
            await producer.setup();
            console.log("se inicio la conexion con el servidor de rabbitmq para notificaciones");

            //enviamos la notificacion al supplier
            const responseNoti = await producer.send(responseuuid.tokenfcm, 'Nueva cita', 'Tienes una nueva cita pendiente de confirmar'); 
            console.log('respuesta de producer que va a notificaciones', responseNoti);


            if (responseNoti.statusCode === 404) {
                return {
                    status: 404,
                    message: responseNoti.message
                };
            }

            return {
                status: 200,
                message: 'Cita creada con éxito.',
            };
        }
    }
}