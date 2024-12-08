import { VirtualAsistantInterface } from "../../domain/repositories/VirtualAsistantInterface";
import { ChatbotModel } from "../models/Mongo/ChatBot";
import { v4 as uuidv4 } from 'uuid';

export class ChatBotMongoRepository implements VirtualAsistantInterface {
    async getchat(userUuid: string): Promise<any> {
        try {
            return ChatbotModel.find({ userUuid });
        } catch (error) {
            console.error('Error en ChatBotMongoRepository:', error);
            throw new Error('Error interno al procesar la solicitud.');
        }
    }
    async getRecomendation(userUuid: string, content: string, complexity: string, simpleResponse:string, complexityResponse:string,suppliers:any ): Promise<any> {
        try {
            const chatBot = new  ChatbotModel({
                uuid: uuidv4(),
                userUuid,
                content,
                suppliers,
                complexity,
                simpleResponse,
                complexityResponse,
            });
    
            return chatBot.save();
        } catch (error) {
            console.error('Error en ChatBotMongoRepository:', error);
            throw new Error('Error interno al procesar la solicitud.');
            
        }
    }
}