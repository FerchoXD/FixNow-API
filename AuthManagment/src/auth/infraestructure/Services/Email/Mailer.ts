import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'fernandodanielp49@gmail.com',
        pass: 'uikdbrqrcwrrgurj'
    }
})

transporter.verify().then(() => {
    console.log('Ready for sends emails')
})

export { transporter }