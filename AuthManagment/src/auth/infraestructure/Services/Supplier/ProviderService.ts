import { Sequelize } from 'sequelize';
import User from '../../models/MySQL/User';

export class ProviderService {
    private static cleanPrompt(prompt: string): string {
        return prompt.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    }

    static async getProvidersByService(prompt: string) {
        console.log("Entrando a la búsqueda de proveedores para el servicio:", prompt);
        const cleanedPrompt = this.cleanPrompt(prompt);
        
        try {
            const providers = await User.findAll({
                where: Sequelize.literal(`JSON_CONTAINS(selectedservices, '["${cleanedPrompt}"]')`),
                attributes: [
                    'uuid', 'firstname', 'lastname', 'quotation', 
                    'hourlyrate', 'selectedservices', 'relevance'
                ]
            });

            return {
                data: providers
            };
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
            throw new Error('No se pudieron obtener los proveedores.');
        }
    }
}
