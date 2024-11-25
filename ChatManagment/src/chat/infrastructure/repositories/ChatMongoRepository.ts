import { ChatInterface } from "../../domain/repositories/ChatInterface";
import { MessageModel } from "../models/Mongo/messageSchema";

export class ChatMongoRepository implements ChatInterface {
    
    async createMessage(sender: string, receiver: string, message: string): Promise<any> {
        try {
            const newMessage = await MessageModel.create({
                sender,
                receiver,
                message,
                timestamp: new Date(),
            });

            return newMessage;
        } catch (error) {
            console.error('Error al crear el mensaje:', error);
            throw new Error('Error al guardar el mensaje en la base de datos.');
        }
    }
    
}