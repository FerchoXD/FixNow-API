import { UserMySqlRepository } from "../../infraestructure/repositories/UserMySqlRepository";
import { UserInterface } from "../../domain/repositories/UserInterface";

export class GetFiltersUseCase {
    constructor(private readonly repository: UserMySqlRepository) {}
    async execute(data: { relevance: any; service: any; quotation: any; hourlyrate: any; }) {

        console.log('Buscando filtros con los datos:', data);
        const filters = await this.repository.getFilters(data);
        if (!filters) {
            throw new Error('Filters not found');
        }
        return filters;
    }
}