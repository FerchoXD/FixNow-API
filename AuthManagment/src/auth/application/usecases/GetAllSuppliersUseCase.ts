import { UserInterface } from "../../domain/repositories/UserInterface";

export class GetAllSuppliersUseCase {
    constructor(readonly repository: UserInterface) { }

    async execute(validField: String): Promise<any> {
        const suppliers = await this.repository.getAllSuppliers(validField);
        if (!suppliers) {
            throw new Error('No hay proveedores registrados');
        }
        return suppliers;
    }
}