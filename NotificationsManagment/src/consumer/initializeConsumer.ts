import { RabbitConsumerNotification } from "./HistoryNotifications";

const consumerHistory = new RabbitConsumerNotification();

export async function initializeConsumer() {
    await consumerHistory.setup();
    await consumerHistory.consume(async (data: any) => {
      console.log('Datos recibidos de historial:', data);
    });
}