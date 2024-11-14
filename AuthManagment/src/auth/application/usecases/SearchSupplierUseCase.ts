import { ProviderService } from "../../infraestructure/Services/Supplier/ProviderService";

export class SearchSupplierUseCase {
    constructor() {}
    async execute(prompt: string) {
        console.log('Buscando proveedores con el prompt:', prompt);
        const providers = await ProviderService.getProvidersByService(prompt);
        return providers;
    }
}
