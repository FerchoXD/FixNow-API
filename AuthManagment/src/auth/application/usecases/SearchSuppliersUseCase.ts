import { UserInterface } from "../../domain/repositories/UserInterface";
import { AnalyzePrompt } from "../../infraestructure/Services/aws/AnalyzePrompt";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class SearchSuppliersUseCase {
    private genAI: GoogleGenerativeAI;

    constructor(
        private readonly repository: UserInterface,
        private readonly analyzePrompt: AnalyzePrompt
    ) {
        this.genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    }

    async execute(prompt: string): Promise<any[]> {
        try {
            const keyPhrases = await this.analyzePrompt.enhancedAnalyzePrompt(prompt);

            if (!keyPhrases || keyPhrases.length === 0) {
                throw new Error('No se detectaron palabras clave en el prompt.');
            }

            // Buscar proveedores relevantes
            const suppliers = await this.repository.findRelevantSuppliers(keyPhrases);

            

            // Filtrar proveedores relevantes usando IA
            const relevantSuppliers = await this.filterSuppliersUsingAI(suppliers, keyPhrases);

            // Ordenar proveedores por relevancia
            const sortedSuppliers = this.sortSuppliersByRelevance(relevantSuppliers);

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

    private async filterSuppliersUsingAI(suppliers: any[], keyPhrases: string[]): Promise<any[]> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
Tienes una lista de proveedores y palabras clave relacionadas con el servicio solicitado. Tu tarea es determinar cuáles proveedores son relevantes.

Palabras clave: ${keyPhrases.join(", ")}

Proveedores:
${suppliers.map((supplier, index) => `
${index + 1}. Nombre: ${supplier.fullname}, Servicios: ${supplier.selectedservices.join(", ")}, Relevancia inicial: ${supplier.relevance}
`).join("")}

Devuelve una lista JSON con los proveedores relevantes (UUID y nombre únicamente).`;

            const result = await model.generateContent(prompt);
            const response = JSON.parse(result.response?.text()?.trim() || "[]");

            console.log("Proveedores filtrados por IA:", response);
            return suppliers.filter((supplier) =>
                response.some((filtered: any) => filtered.uuid === supplier.uuid)
            );
        } catch (error) {
            console.error("Error al filtrar proveedores con IA:", error);
            return suppliers; // Devolver todos si falla
        }
    }

    private sortSuppliersByRelevance(suppliers: any[]): any[] {
        return suppliers.sort((a, b) => b.relevance - a.relevance);
    }
}
