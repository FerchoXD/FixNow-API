import { VirtualAsistantInterface } from "../../domain/repositories/VirtualAsistantInterface";
import { ChatbotModel } from "../models/Mongo/ChatBot";
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';

export class ChatBotMongoRepository implements VirtualAsistantInterface {
    async getchat(userUuid: string): Promise<any> {
        try {
            return ChatbotModel.find({ userUuid });
        } catch (error) {
            console.error('Error en ChatBotMongoRepository:', error);
            throw new Error('Error interno al procesar la solicitud.');
        }
    }
    async getRecomendation(userUuid: string, content: string, complexity: any, simpleResponse:any, complexityResponse:any,suppliers:any, response:any ): Promise<any> {
        console.log('ChatBotMongoRepository', userUuid, content, complexity, simpleResponse, complexityResponse, suppliers, response);
        try {
            const chatBot = new  ChatbotModel({
                uuid: uuidv4(),
                userUuid,
                content,
                suppliers,
                response,
                complexity,
                simpleResponse,
                complexityResponse,
            });

            console.log('ChatBotMongoRepository', chatBot);
    
            return chatBot.save();
        } catch (error) {
            console.error('Error en ChatBotMongoRepository:', error);
            throw new Error('Error interno al procesar la solicitud.');
            
        }
    }
}