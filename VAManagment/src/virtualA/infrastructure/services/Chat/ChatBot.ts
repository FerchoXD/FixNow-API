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

private async isGreeting(content: string): Promise<boolean> {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
      El siguiente texto debe ser analizado para determinar si es un saludo común en español. 
      Un saludo común puede incluir expresiones como "hola", "buenos días", "qué tal", etc. 
      Responde con "true" si es un saludo, o "false" si no lo es.

      Texto: "${content}"

      Tu respuesta (true/false):
            `;
      const result = await model.generateContent(prompt);
      const response = result.response?.text()?.trim().toLowerCase();
      return response === "true";
  } catch (error) {
      console.error("Error al evaluar si es un saludo con IA:", error);
      return false;
  }
}

private async classifyInput(content: string): Promise<string> {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Eres un asistente experto en clasificar textos en una de las siguientes categorías. Debes analizar cuidadosamente el texto proporcionado y clasificarlo según las instrucciones de cada categoría. Sigue las definiciones estrictamente y no adivines si no estás seguro.

**Categorías y Reglas:**

1. **"greeting"**:
   - Textos que son saludos comunes en español. 
   - Incluyen frases que inician una conversación de forma amigable, como "hola", "buenos días", "buenas tardes", etc.
   - **No clasifiques** preguntas, comentarios o solicitudes como "greeting" aunque incluyan un saludo al inicio.

2. **"nonsense"**:
   - Textos que no tienen sentido o son completamente incoherentes.
   - Incluyen cadenas de caracteres aleatorios, palabras sin relación, frases sin estructura lógica, o mensajes que no forman una oración comprensible.
   - **No clasifiques** textos con preguntas claras o palabras relacionadas a servicios como "nonsense".

3. **"offensive"**:
   - Textos que contienen palabras ofensivas, groseras o insultantes, ya sea dirigidas al asistente o cualquier otra persona. 
   - Ejemplo de palabras ofensivas: "puto", "idiota", "imbécil", "estúpido", "mierda", "tonto", "jodido", entre otras.
   - **Incluye** combinaciones donde la intención es claramente grosera, como "puto plomero" o "todos son idiotas".
   - **No clasifiques** como "offensive" si no hay intención de insultar, aunque incluyan palabras fuertes en un contexto técnico (e.g., "tubo roto por la mierda").

4. **"service"**:
   - Textos relacionados con **exactamente** los siguientes servicios:
     - Plomería
     - Electricidad
     - Carpintería
     - Pintura
     - Limpieza
     - Jardinería
     - Albañilería
     - Cerrajería
     - Electrodomésticos
     - Climatización
     - Impermeabilización
   - El texto debe mencionar tareas, problemas, o solicitudes específicas relacionadas con los servicios enumerados. También puede incluir solicitudes para encontrar proveedores o técnicos de estos servicios.
   - **No clasifiques** como "service" textos que no incluyan explícitamente palabras o frases relacionadas con los servicios enumerados.

5. **"unrelated"**:
   - Textos que no tienen relación con los servicios enumerados ni con el propósito de la aplicación (mantenimiento y reparación de viviendas).
   - Incluye preguntas o comentarios fuera del ámbito de los servicios ofrecidos, como gustos personales, temas científicos, políticos o de entretenimiento.
   - **No clasifiques** como "unrelated" si el texto menciona servicios o problemas relevantes.

6. **"sensitive"**:
   - Textos que intentan acceder a información sensible de la aplicación, como:
     - Claves API
     - Configuraciones internas
     - Bases de datos
     - Listas completas de usuarios, clientes, proveedores, o técnicos
   - También incluye solicitudes amplias como "muéstrame todos los datos" o "dame acceso a todos los proveedores".
   - **No clasifiques** solicitudes específicas relacionadas con servicios disponibles como "trae todos los albañiles".

**Texto del usuario:** "${content}"

**Clasifica el texto en una de las categorías anteriores:** 
(greeting/nonsense/offensive/service/unrelated/sensitive)
`;

      const result = await model.generateContent(prompt);
      const response = result.response?.text()?.trim().toLowerCase();
      return response || "unrelated";
  } catch (error) {
      console.error("Error al clasificar la entrada con IA:", error);
      return "unrelated";
  }
}

async run(content: string): Promise<any> {
  const inputType = await this.classifyInput(content);
  console.log("Tipo de entrada detectado:", inputType);

  switch (inputType) {
      case "greeting":
          const greetingResponse = "¡Hola! Soy Mailo, tu asistente virtual de FixNow. ¿Cómo puedo ayudarte hoy?";
          this.addToContext(content, greetingResponse);
          return greetingResponse;

      case "nonsense":
          const nonsenseResponse = "Hmm, Mailo no esta seguro de entenderte. ¿Podrías intentar preguntar algo relacionado con servicios de mantenimiento o reparación?";
          this.addToContext(content, nonsenseResponse);
          return nonsenseResponse;

      case "offensive":
          const offensiveResponse = "A Mailo no le gustan las palabras ofensivas. Por favor, mantengamos una conversación respetuosa. Estoy aquí para ayudarte con servicios de mantenimiento y reparación.";
          this.addToContext(content, offensiveResponse);
          return offensiveResponse;

      case "sensitive":
          const sensitiveResponse = "Por seguridad, Mailo no puede compartir información interna de la aplicación. Si tienes dudas sobre cómo usar FixNow, estoy aquí para ayudarte.";
          this.addToContext(content, sensitiveResponse);
          return sensitiveResponse;

      case "service":
          const analysis = await this.analyzePrompt(content);
          console.log("Análisis de servicio hola:", analysis);

          if (analysis.service) {
              if (analysis.complexity === "simple") {
                  const simpleResponse = await this.getSimpleResponse(content);
                  this.addToContext(content, simpleResponse);
                  return { simpleResponse, analysis };
              } else if (analysis.complexity === "complex") {
                  const complexResponse = `Entiendo que necesitas ayuda con ${analysis.service}. Tenemos técnicos especializados que pueden ayudarte. A continuación te muestro los técnicos disponibles.`;
                  this.addToContext(content, complexResponse);
                  console.log("Servicio detectado:", analysis.service);
                  console.log("Complejidad detectada:", analysis.complexity);
                  return { complexResponse, analysis };
              }
          }

          const notFoundResponse = "Mailo no pudo identificar un servicio relevante en tu solicitud. Intenta ser más específico.";
          this.addToContext(content, notFoundResponse);
          return notFoundResponse;

      case "unrelated":
      default:
          const unrelatedResponse = "La función principal de Mailo es ayudarte con servicios de mantenimiento y reparación en el hogar. Si tienes una pregunta relacionada, no dudes en preguntarme.";
          this.addToContext(content, unrelatedResponse);
          return unrelatedResponse;
  }
}


private async analyzePrompt(content: string): Promise<any> {
  try {
      // Prompt para identificar el servicio
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Eres un asistente experto en identificar servicios relacionados con el mantenimiento y reparación de viviendas. Aquí están los servicios que puedes reconocer:

- Plomería
- Electricidad
- Carpintería
- Pintura
- Limpieza
- Jardinería
- Albañilería
- Cerrajería
- Electrodomésticos
- Climatización
- Impermeabilización

Dado el siguiente texto, identifica el servicio relevante. Si no puedes identificar un servicio, responde "null".

Ejemplo:
Texto: "Tengo un problema con una fuga de agua en mi cocina."
Respuesta: "Plomería"

Texto: "Necesito reparar un corto circuito en mi casa."
Respuesta: "Electricidad"

Texto: "${content}"
Respuesta:
      `;

      // Realizar la consulta al modelo
      const result = await model.generateContent(prompt);
      const detectedService = result.response?.text()?.trim();

      if (!detectedService || detectedService.toLowerCase() === "null") {
          return { service: null, complexity: null };
      }

      // Clasificar la complejidad usando getComplexityFromAI
      const complexity = await this.getComplexityFromAI(content);

      console.log("Servicio detectado:", detectedService);
      console.log("Complejidad detectada:", complexity);

      return { service: detectedService, complexity };
  } catch (error) {
      console.error("Error al analizar el prompt con IA:", error);
      return { service: null, complexity: null };
  }
}


private async getComplexityFromAI(content: string): Promise<"simple" | "complex" | null> {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
Tienes la tarea de clasificar solicitudes en dos categorías: "simple" y "complex". Aquí están las definiciones y más ejemplos para ayudarte:

**Definición de "simple":**
- Estas tareas pueden ser realizadas por un adulto promedio utilizando herramientas comunes y sin necesidad de conocimientos técnicos avanzados.
- Ejemplos:
- Cambiar un foco quemado.
- Limpiar un jardín.
- Pintar una pared.
- Ajustar una puerta que roza el suelo.
- Reparar una mesa floja.

**Definición de "complex":**
- Estas tareas requieren conocimientos técnicos, experiencia previa, o el uso de herramientas especializadas. Generalmente, son realizadas por un profesional o técnico especializado.
- Ejemplos:
- Reparar un circuito eléctrico dañado.
- Cambiar un fusible en un tablero eléctrico.
- Impermeabilizar un techo con fugas.
- Reparar un refrigerador que no enfría.
- Restaurar una mesa rota con partes faltantes.

Por favor, clasifica la siguiente solicitud basándote en estas definiciones y ejemplos. Si no puedes determinar la categoría, responde "null".

Solicitud: "${content}"

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
