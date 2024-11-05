import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'email',
        pass: 'contraseña de aplicacion'
    }
})

transporter.verify().then(() => {
    console.log('Ready for sends emails')
})

export { transporter }