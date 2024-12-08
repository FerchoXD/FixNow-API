import { VirtualAsistantInterface } from "../../domain/repositories/VirtualAsistantInterface";
import { fixNowAssistant } from "../../infrastructure/services/Chat/ChatBot";
import { ProducerSuppliers } from "../../infrastructure/services/rabbit/producer/RabbitProducerSuppliers";

export class RecomendationChatUseCase {
    constructor(readonly repository: VirtualAsistantInterface) { }

    async execute(userUuid: string, content: string): Promise<any> {
        try {
            const producer = new ProducerSuppliers();
            await producer.setup();

            const response = await fixNowAssistant.run(content);

            console.log('Respuesta de fixNowAssistant:', response);

            // Validar si la respuesta tiene el análisis necesario
            const complexity = response.analysis?.complexity || null;
            const complexResponse = response.complexResponse || null;
            const simpleResponse = response.simpleResponse || null;
            
            if (complexity === 'complex') {
                console.log('Respuesta compleja:', complexResponse);
                console.log("content", content);
                const suppliers = await producer.send(content); 
                
                const save = await this.repository.getRecomendation(userUuid, content, complexity, complexResponse, simpleResponse,suppliers);
                return { complexResponse, suppliers };
            }

            if (complexity === 'simple'){
                return { simpleResponse };
            }

            throw new Error("No se pudo obtener la recomendación");
        } catch (error) {
            console.error('Error en RecomendationChatUseCase:', error);
            throw new Error('Error interno al procesar la solicitud.');
        }
    }
}
