import User from "../../models/MySQL/User";
import { EmailPort } from "./EmailPort";
import nodemailer from 'nodemailer';
import { transporter } from "./Mailer";


export class EmailService implements EmailPort {
    async run(user: any): Promise<void> {
        const opcionesCorreo = {

            from: process.env.EMAIL_FROM, // Debe ser el mismo email usado en la autenticación del transporter

            to: user.email,
            subject: 'Activacion de Cuenta', // Asunto del correo
            text: user.activationToken,
            html: `<h1>Tu token de activación es: ${user.activationToken}.</h1>`,
        };
        try {
            // Enviar el correo
            const info = await transporter.sendMail(opcionesCorreo);
            console.log('Correo enviado con éxito: %s', info.messageId);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }    
    }

}