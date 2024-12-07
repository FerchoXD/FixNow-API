import * as admin from 'firebase-admin';
import serviceAccount from './firebase-admin.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const fcm = admin.messaging();

export class ServiceNotification {
  async sendNotification(
    tokenfcm: string,
    title: string,
    body: string,
    type: string,
    serviceId: string
  ): Promise<{ status: string; firebaseResponse?: string }> {
    const message = {
      token: tokenfcm,
      notification: {
        title,
        body,
        image: type === 'service' ? 'https://fixnow.s3.us-east-2.amazonaws.com/solucion-de-problemas.png' : 'https://fixnow.s3.us-east-2.amazonaws.com/conversation-87.png',
      },
      data: {
        type: type,
        serviceId: serviceId,
        status: 'success',
      },
    };

    console.log('Enviando notificación:', message);
    try {
      const response = await fcm.send(message);
      console.log('Respuesta de firebase:', response);
      return { status: 'success'};
    } catch (error: any) {
      console.error('Error enviando la notificación:', error);
      throw new Error(`No se pudo enviar la notificación: ${error.message}`);
    }
  }
}
