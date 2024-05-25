import nodemailer from 'nodemailer';

export class NodemailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.example.com', // Замените на ваш SMTP хост
            port: 587, // Замените на ваш SMTP порт
            secure: false, // true для 465, false для других портов
            auth: {
                user: 'your_email@example.com', // Ваш email
                pass: 'your_email_password', // Ваш пароль от email
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: '"Your App Name" <your_email@example.com>', // Ваш email
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}

export const nodemailerService = new NodemailerService();
