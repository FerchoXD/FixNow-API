import { GetAllSuppliersUseCase } from "../../application/usecases/GetAllSuppliersUseCase";
import { Response, Request } from "express";

export class GetAllSuppliersController {
    constructor(readonly usecase: GetAllSuppliersUseCase) {}

    async run(req: Request, res: Response): Promise<any> {
        try {
            // Obtener la data del cuerpo de la solicitud
            const { data } = req.body;

            // Validar que 'data' sea un string
            if (!data || typeof data !== "string") {
                return res
                    .status(400)
                    .json({ message: "El campo 'data' es requerido y debe ser una cadena de texto." });
            }

            // Categorías válidas
            const validCategories = [
                "All",
                "Plomería",
                "Electricidad",
                "Carpintería",
                "Pintura",
                "Limpieza general",
                "Jardinería",
                "Albañilería",
                "Fontanería",
                "Cerrajería",
                "Electrodomésticos",
                "Climatización",
                "Impermeabilización",
            ];

            // Verificar si 'data' pertenece a las categorías válidas
            if (!validCategories.includes(data)) {
                return res
                    .status(400)
                    .json({ message: `La categoría '${data}' no es válida. Por favor, selecciona una de las categorías válidas.` });
            }

            // Ejecutar el caso de uso con la categoría válida
            const suppliers = await this.usecase.execute(data);

            // Verificar si se encontraron proveedores
            if (!suppliers || suppliers.length === 0) {
                return res.status(404).json({ message: "No se encontraron proveedores para esta categoría." });
            }

            // Respuesta exitosa
            return res.status(200).json(suppliers);
        } catch (error) {
            console.error("Error en GetAllSuppliersController:", error);
            return res.status(500).json({ message: "Error interno del servidor." });
        }
    }
}
