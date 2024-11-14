import { Sequelize, Op, where } from "sequelize";
import User from "../../models/MySQL/User";

interface SuggestedService {
    uuid: string;
    firstname: string;
    lastname: string;
    quotation: number;
    hourlyrate: number;
    selectedservices: string[];
    relevance: number;
}

export class SendPromptToGemini {
    constructor() {}

    async getSuggestedServices(prompt: string): Promise<SuggestedService[]> {
        try {
            // Divide el prompt en palabras clave para la búsqueda
            const keywords = prompt.split(" ");

            // Consulta a la base de datos buscando coincidencias en `selectedservices` usando JSON_CONTAINS
            const users = await User.findAll({
                where: {
                    selectedservices: {
                        [Op.contains]: keywords.map((keyword) => `"${keyword}"`), // JSON_CONTAINS busca la palabra exacta en un array JSON
                    },
                },
            });

            // Mapea los datos obtenidos en el formato de SuggestedService
            const suggestedServices: SuggestedService[] = users.map((user) => ({
                uuid: user.uuid,
                firstname: user.firstname,
                lastname: user.lastname,
                quotation: user.quotation,
                hourlyrate: user.hourlyrate,
                selectedservices: user.selectedservices,
                relevance: Math.random() * (1 - 0.8) + 0.8, // Cálculo de relevancia
            }));

            return suggestedServices;

        } catch (error) {
            console.error('Error al obtener sugerencias de servicios:', error);
            throw new Error('No se pudieron obtener sugerencias de servicios de la base de datos');
        }
    }
}
