import { UserInterface } from "../../domain/repositories/UserInterface";
import { AnalyzePrompt } from "../../infraestructure/Services/aws/AnalyzePrompt";

export class SearchSuppliersUseCase {
    constructor(
        private readonly repository: UserInterface,
        private readonly analyzePrompt: AnalyzePrompt // Pasar instancia como dependencia
    ) {}

    async execute(prompt: string): Promise<any[]> {
        try {
            // Usar el análisis híbrido (Comprehend + Regex)
            const keyPhrases = await this.analyzePrompt.enhancedAnalyzePrompt(prompt);
    
            if (!keyPhrases || keyPhrases.length === 0) {
                throw new Error('No se detectaron palabras clave en el prompt.');
            }
    
            // Buscar proveedores relevantes basados en las palabras clave
            const suppliers = await this.repository.findRelevantSuppliers(keyPhrases);
    
            const sortedSuppliers = this.sortSuppliersByRelevance(suppliers);
    
            return sortedSuppliers;
        } catch (error) {
            if ((error as Error).message === "No se detectaron palabras clave en el prompt.") {
                console.error('Error en SearchSuppliersUseCase:', (error as Error).message);
                throw new Error('No se detectaron palabras clave en el prompt.');
            }
            console.error('Error en SearchSuppliersUseCase:', error);
            throw new Error('No se pudo procesar la solicitud de búsqueda de proveedores.');
        }
    }
    

    private sortSuppliersByRelevance(suppliers: any[]): any[] {
        return suppliers.sort((a, b) => b.relevance - a.relevance);
    }
}
