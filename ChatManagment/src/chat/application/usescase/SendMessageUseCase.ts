import { ChatInterface } from "../../domain/repositories/ChatInterface";
import { io } from "../../app"; // Asegúrate de que el path sea correcto

export class SendMessageUseCase {
    constructor(
        private readonly repository: ChatInterface,
    ) {}

    async execute(data: { sender: string; receiver: string; content: string }): Promise<any> {
        try {
            // Guarda el mensaje en la base de datos
            const savedMessage = await this.repository.saveMessage(data);

            // Notifica al receptor a través de WebSocket
            const receiverSocketId = this.getReceiverSocketId(data.receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", savedMessage);
            } else {
                console.log(`El receptor ${data.receiver} no está conectado.`);
            }

            console.log(`Mensaje enviado de ${data.sender} a ${data.receiver}`);
            return savedMessage;
        } catch (error) {
            console.error("Error en SendMessageUseCase:", error);
            throw new Error("No se pudo guardar el mensaje ni notificar al receptor.");
        }
    }

    // Esta función puede buscar el socket ID del receptor en la lista de usuarios conectados
    private getReceiverSocketId(userId: string): string | undefined {
        // Supongamos que tienes un objeto o función para manejar usuarios en línea
        const onlineUsers: Record<string, string> = {}; // Debes tener esta lógica definida en tu infraestructura
        return onlineUsers[userId];
    }
}
