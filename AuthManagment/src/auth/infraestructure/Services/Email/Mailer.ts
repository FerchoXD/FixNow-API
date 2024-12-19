import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    //secure: process.env.NODE_ENV !== 'development',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD_APPLICATION,
        },
    /*tls: {
        rejectUnauthorized: process.env.NODE_ENV !== 'development',
    }*/
});

