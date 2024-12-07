import * as admin from 'firebase-admin';
import serviceAccount from './firebase-admin.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const fcm = admin.messaging();

export class ServiceNotification {
  async sendNotification(tokenfcm: string, title: string, body: string): Promise<any> {
    
    const message = {
        notification: {
            title,
            body,
        },
        token: tokenfcm,
    }

    try {
        const response = await fcm.send(message);

        console.log('Respuesta de firebase:', response);
        return status = "sucess";
    } catch (error) {
        console.error('Error enviando la notificación:', error);
        throw new Error('No se pudo enviar la notificación.');
        
    }

    console.log(`Enviando notificación a ${tokenfcm} con título "${title}" y cuerpo "${body}"`);
    }
}
