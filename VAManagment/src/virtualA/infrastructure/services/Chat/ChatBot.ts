import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar el cliente de Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const acceptedServices = [
  "Plomería",
  "Electricidad",
  "Carpintería",
  "Pintura",
  "Limpieza",
  "Jardinería",
  "Albañilería",
  "Cerrajería",
  "Electrodomésticos",
  "Climatización",
  "Impermeabilización"
];

// Clase para manejar contexto y respuestas
class FixNowAssistant {
  private context: string[];

  constructor() {
    this.context = [];
  }

  async run(content: string): Promise<any> {
    // Respuesta predefinida para saludos
    if (this.isGreeting(content)) {
        const greetingResponse = "Hola, mi nombre es Mailo, el asistente virtual de FixNow. ¿En qué puedo ayudarte?";
        this.addToContext(content, greetingResponse);
        return greetingResponse;
    }

    // Analizar el tipo de solicitud (esperar la resolución de la Promise)
    const analysis = await this.analyzePrompt(content);
    console.log(analysis);

    if (analysis.service) {
        if (analysis.complexity === "simple") {
            const simpleResponse = await this.getSimpleResponse(content);
            this.addToContext(content, simpleResponse);
            return { simpleResponse, analysis };
        } else if (analysis.complexity === "complex") {
            const complexResponse = `Entiendo que necesitas ayuda con ${analysis.service}. Tenemos técnicos especializados que pueden ayudarte. A continuación te muestro los técnicos disponibles para ayudarte con tu problema.`;
            console.log("n",analysis);
            this.addToContext(content, complexResponse);
            console.log("n",analysis);
            return { complexResponse, analysis };
        }
    }

    // Si el servicio no existe
    const notFoundResponse = "Lo siento, pero no contamos con el servicio que mencionas. Por favor, verifica si se relaciona con alguno de estos: " + acceptedServices.join(", ") + ".";
    this.addToContext(content, notFoundResponse);
    return notFoundResponse;
}

  // Detectar saludos en el mensaje
  private isGreeting(content: string): boolean {
    const greetings = [
      "hola", "buenos días", "buenas tardes", "buenas noches", "qué tal", "cómo estás",
      "hello", "hi", "hey", "saludos", "que tal?", "como estas?", "hola!"
    ];
    const lowerContent = content.toLowerCase();
    return greetings.some((greeting) => lowerContent.includes(greeting));
  }

  private async analyzePrompt(content: string): Promise<any> {
    const lowerContent = content.toLowerCase();
    let detectedService: string | null = null;

    // Palabras clave para detectar servicios
    const serviceKeywords: Record<string, string[]> = {
        "Plomería": ["fugas", "grifo", "tuberías", "agua", "plomería"],
        "Electricidad": [
            "foco", "cableado", "enchufe", "interruptor",
            "electricidad", "circuito", "instalación eléctrica",
            "instalaciones eléctricas", "eléctrico", "problema eléctrico",
            "fallo eléctrico", "cable quemado", "corto circuito",
            "fusible quemado", "tablero eléctrico", "electricista", "electrica",
        ],
        "Carpintería": ["madera", "puerta", "carpintería", "reparar muebles"],
        "Pintura": ["pintura", "pared", "colores", "brocha"],
        "Limpieza": ["limpieza", "desinfectar", "aseo", "manchas"],
        "Jardinería": ["jardín", "podar", "césped", "flores", "árboles"],
        "Albañilería": ["albañilería", "paredes", "cemento", "bloques"],
        "Cerrajería": ["llave", "cerradura", "puerta", "cerrajería"],
        "Electrodomésticos": ["electrodomésticos", "refrigerador", "lavadora", "microondas"],
        "Climatización": ["aire acondicionado", "climatización", "calefacción"],
        "Impermeabilización": ["impermeabilizar", "gotera", "techo", "humedad"]
    };

    // Detectar el servicio más probable
    for (const [service, keywords] of Object.entries(serviceKeywords)) {
        if (keywords.some(keyword => lowerContent.includes(keyword))) {
            detectedService = service;
            break;
        }
    }

    // Si no se detecta un servicio, devolvemos un resultado vacío
    if (!detectedService) {
        return { service: null, complexity: null };
    }

    // Determinar complejidad usando IA
    const complexity = await this.getComplexityFromAI(content);

    return { service: detectedService, complexity };
}

private async getComplexityFromAI(content: string): Promise<"simple" | "complex" | null> {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Tienes la tarea de clasificar solicitudes en dos categorías: "simple" y "complex". Aquí están las definiciones y ejemplos para ayudarte a tomar una decisión:

- Una solicitud "simple" se refiere a tareas que cualquier adulto promedio puede realizar con herramientas básicas y sin conocimientos técnicos avanzados.
Ejemplos:
  - Cambiar un foco quemado.
  - Limpiar un jardín.
  - Pintar una pared.
  - Ajustar una puerta que roza el suelo.
  
- Una solicitud "complex" requiere conocimientos técnicos específicos, experiencia previa o el uso de herramientas especializadas. Por lo general, estas tareas deben ser realizadas por un profesional o técnico especializado.
Ejemplos:
  - Reparar un circuito eléctrico dañado.
  - Cambiar un fusible en un tablero eléctrico.
  - Impermeabilizar un techo con fugas.
  - Reparar un refrigerador que no enfría.

Por favor, clasifica la siguiente solicitud basándote en estas definiciones y ejemplos. Si no puedes determinarlo con certeza, responde "null".

Solicitud: ${content}

Tu clasificación (simple/complex/null):
      `;
      const result = await model.generateContent(prompt);
      const response = result.response?.text()?.trim().toLowerCase();

      if (response === "simple") {
          return "simple";
      } else if (response === "complex") {
          return "complex";
      } else {
          return null;
      }
  } catch (error) {
      console.error("Error al evaluar la complejidad con IA:", error);
      return null;
  }
}


private async getSimpleResponse(content: string): Promise<any> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Dame una guía sencilla y detallada para el siguiente problema: ${content}`;
        const result = await model.generateContent(prompt);
        const rawResponse = result.response?.text() || "Lo siento, no pude generar una respuesta. Intenta nuevamente.";
        return this.cleanText(rawResponse);
    } catch (error) {
        console.error("Error generando respuesta simple:", error);
        return "Lo siento, ocurrió un error al procesar tu solicitud.";
    }
}


  // Agregar mensajes al contexto
  private addToContext(userMessage: string, aiResponse: string): void {
    this.context.push(`Usuario: ${userMessage}`);
    this.context.push(`Mailo: ${aiResponse}`);
  }

  private cleanText(markdownText: string): string {
    return markdownText
        .replace(/(?:__|[*#])|\[(.*?)\]\(.*?\)/g, '$1') // Quitar negritas, itálicas y enlaces Markdown
        .replace(/\n+/g, ' ') // Eliminar saltos de línea repetidos
        .replace(/^\s+|\s+$/g, '');
}

}

// Exportar una instancia del asistente
export const fixNowAssistant = new FixNowAssistant();
