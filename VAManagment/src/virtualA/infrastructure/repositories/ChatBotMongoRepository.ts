import { VirtualAsistantInterface } from "../../domain/repositories/VirtualAsistantInterface";
import { ChatbotModel } from "../models/Mongo/ChatBot";
import { v4 as uuidv4 } from 'uuid';

export class ChatBotMongoRepository implements VirtualAsistantInterface {
    getRecomendation(userUuid: string, content: string, complexity: string, ): Promise<any> {
        console.log('ChatBotMongoRepository');
        throw new Error('Method not implemented.');
    }
}