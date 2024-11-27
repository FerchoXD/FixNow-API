import { ComprehendClient, DetectKeyPhrasesCommand } from '@aws-sdk/client-comprehend';

export class AnalyzePrompt {
    private client: ComprehendClient;

    constructor() {
        this.client = new ComprehendClient({
            region: 'us-east-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    async execute(prompt: string): Promise<string[]> {
        try {
            const command = new DetectKeyPhrasesCommand({
                LanguageCode: 'es',
                Text: prompt,
            });

            const response = await this.client.send(command);
            const keyPhrases = response.KeyPhrases?.map((phrase) => phrase.Text?.toLowerCase() || '') || [];

            console.log('Palabras clave detectadas (Comprehend):', keyPhrases);
            return keyPhrases;
        } catch (error) {
            console.error('Error en AnalyzePrompt:', error);
            throw new Error('No se pudo analizar el prompt.');
        }
    }

    
    detectProfessions(prompt: string): string[] {
        const professionMapping = {
            'Plomería': [
                'plomería', 'plomero', 'cañería', 'tubería', 'grifo', 'fugas de agua', 
                'llave de paso', 'válvula', 'inodoro', 'drenaje', 'desagüe', 'cisterna', 
                'reparación de fugas', 'instalación de tuberías', 'toma de agua', 'baño', 'cisterna rota'
            ],
            'Electricidad': [
                'electricidad', 'electricista', 'eléctrico', 'luz', 'corriente eléctrica', 'voltaje', 
                'interruptor', 'cortocircuito', 'fusible', 'cableado', 'panel eléctrico', 
                'enchufe', 'toma corriente', 'instalación eléctrica', 'apagón', 'reparar luz', 'transformador', 
                'mantenimiento eléctrico', 'cable roto', 'circuito', 'alumbrado'
            ],
            'Carpintería': [
                'carpintería', 'carpintero', 'madera', 'muebles', 'puerta de madera', 'armario', 
                'estantería', 'reparación de muebles', 'sillas', 'mesa', 'cajonera', 
                'puerta rota', 'marcos de madera', 'puertas corredizas', 'barnizado', 'lacado', 'tallado', 
                'fabricación de muebles', 'madera dañada'
            ],
            'Pintura': [
                'pintura', 'pintor', 'paredes', 'brocha', 'pintar', 'rodillo', 'lata de pintura', 
                'pared agrietada', 'color de pared', 'remodelación de pintura', 'pintura de exteriores', 
                'pintura de interiores', 'mantenimiento de pintura', 'esmalte', 'manchas en paredes', 'pintura deteriorada'
            ],
            'Limpieza general': [
                'limpieza', 'limpiar', 'mugre', 'polvo', 'ordenar', 'barrer', 'fregar', 'trapeador', 
                'aspiradora', 'quitar manchas', 'desinfección', 'limpieza profunda', 'cocina limpia', 
                'baño limpio', 'vidrios', 'limpieza de oficinas', 'limpieza de casas', 'limpiar alfombras', 
                'organización', 'servicio de limpieza', 'suciedad', 'grasa'
            ],
            'Jardinería': [
                'jardinería', 'jardinero', 'césped', 'poda', 'plantas', 'mantenimiento de jardines', 
                'flor', 'cortar césped', 'arboles', 'hojas', 'fertilizante', 'desmalezado', 'riego', 
                'mantenimiento de césped', 'decoración de jardines', 'jardín seco', 'sembrar', 'paisajismo', 
                'jardines verticales', 'plantación', 'cuidado de arbustos', 'jardín bonito'
            ],
            'Albañilería': [
                'albañilería', 'albañil', 'cemento', 'ladrillos', 'construcción', 'pared', 'cimientos', 
                'revoque', 'mampostería', 'mezcla', 'levantamiento de muros', 'trabajo de albañilería', 
                'obra negra', 'plafones', 'acabados', 'columnas', 'cimientos', 'reparación de muros', 
                'piso', 'azulejos', 'remodelación de casas', 'pared dañada'
            ],
            'Fontanería': [
                'fontanería', 'fontanero', 'agua', 'tuberías', 'llave de agua', 'grifo', 'fugas de agua', 
                'desagüe', 'cisterna', 'válvula', 'instalación de agua', 'drenaje obstruido', 
                'inodoro', 'fregadero', 'baño tapado', 'reparación de tuberías', 'mantenimiento de agua', 
                'cambio de tuberías', 'tubería rota'
            ],
            'Cerrajería': [
                'cerrajería', 'cerrajero', 'cerradura', 'llaves', 'puerta cerrada', 'apertura de puertas', 
                'llave rota', 'candado', 'cerradura electrónica', 'cambio de cerraduras', 
                'seguridad de puertas', 'reparación de cerraduras', 'puerta dañada', 'forzar cerradura', 
                'reemplazo de llaves', 'llave atascada', 'cerradura de seguridad'
            ],
            'Reparación de electrodomésticos': [
                'electrodomésticos', 'reparación', 'microondas', 'lavadora', 'secadora', 'refrigerador', 
                'televisión', 'horno', 'lavavajillas', 'cafetera', 'licuadora', 'aire acondicionado', 
                'cocina eléctrica', 'fallas eléctricas', 'reparar aparato', 'calentador de agua', 
                'equipos de cocina', 'reparación de línea blanca', 'mantenimiento de electrodomésticos'
            ],
            'Mantenimiento de aires acondicionados': [
                'aire acondicionado', 'mantenimiento', 'clima', 'refrigeración', 'reparar', 
                'fugas de gas', 'filtros de aire', 'compresor', 'termostato', 'instalación de aire', 
                'reparación de clima', 'servicio de aire acondicionado', 'enfriamiento', 'ventilador', 
                'limpieza de filtros', 'temperatura'
            ],
            'Reparación de techo y filtraciones': [
                'techo', 'filtraciones', 'gotera', 'tejas', 'impermeabilización', 'reparación de techos', 
                'techo roto', 'mantenimiento de techos', 'agua filtrada', 'grietas en techo', 
                'techo agrietado', 'sellado', 'revestimiento', 'techumbre', 'reparar techo'
            ],
        };
        
        const detectedProfessions = Object.entries(professionMapping)
            .filter(([profession, keywords]) => keywords.some(keyword => prompt.toLowerCase().includes(keyword)))
            .map(([profession]) => profession);

        console.log('Profesiones detectadas:', detectedProfessions);
        return detectedProfessions;
    }

    async enhancedAnalyzePrompt(prompt: string): Promise<string[]> {
        try {
            const comprehendKeyPhrases = await this.execute(prompt);
            const regexProfessions = this.detectProfessions(prompt);

            const combinedKeyPhrases = Array.from(new Set([...comprehendKeyPhrases, ...regexProfessions]));

            console.log('Palabras clave combinadas (Comprehend + Regex):', combinedKeyPhrases);
            return combinedKeyPhrases;
        } catch (error) {
            console.error('Error en enhancedAnalyzePrompt:', error);
            throw new Error('No se pudo analizar el prompt con el enfoque híbrido.');
        }
    }
}
