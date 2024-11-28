import { ChatInterface } from "../../domain/repositories/ChatInterface";
import Message  from "../models/Mongo/messageSchema";
import moment from 'moment-timezone';
import 'moment/locale/es';

moment.locale('es');
export class ChatMongoRepository implements ChatInterface {

    async saveMessage(data: { sender: string; receiver: string; content: string }): Promise<any> {
        try {

            // Crear una nueva instancia del modelo
            const newMessage = new Message({
                senderId: data.sender,
                recipientId: data.receiver,
                content: data.content,
            });

            await newMessage.save();

            const response = await Message.find({
                $or: [
                    { senderId: data.sender, recipientId
                        : data.receiver },
                    { senderId: data.receiver, recipientId
                        : data.sender },
                ],
            }).sort({ timestamp: 1 });

            const formattedResponse = response.map((message) => ({
                ...message.toObject(),
                timestamp: moment(message.timestamp).tz('America/Mexico_City').format('HH:mm:ss'),
            }));
            // Retornar el mensaje guardado
            return {
                status: 200,
                data: formattedResponse,
            };
        } catch (error) {
            console.error('Error guardando el mensaje:', error);
            throw new Error('No se pudo guardar el mensaje.');
        }
    }
    
}