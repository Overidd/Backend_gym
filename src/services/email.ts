import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { envs } from '../config';

export type IPayloadSendEmail = {
   name: string,
   codeAccess: string,
   qrCode: any,
   email: string,
   password?: string,
   pathHtml: string,
}

export class EmailNodemailer {
   static async sendEmailmembers(payload: IPayloadSendEmail): Promise<any | null> {
      try {
         // email.subcription.user.ejs
         const templatePath = path.join(__dirname, `../templates/${payload.pathHtml}`);

         const htmlContent = await ejs.renderFile(templatePath, { ...payload, });

         const transporter = nodemailer.createTransport({
            service: 'gmail',
            // port: 587,
            // secure: false,
            auth: {
               user: envs.email_name,
               pass: envs.email_key,
            },
         });

         const mailOptions = {
            from: `Servicio gym <${envs.email_name}>`,
            to: payload.email,
            subject: 'Bienvenido ' + payload.name,
            html: htmlContent,
            attachments: [
               {
                  filename: 'qrcode.png',
                  content: payload.qrCode,
                  contentType: 'image/png',
                  cid: 'qrCodeImage', // Identificador único para el contenido en línea
               },
            ],
         };
         const result = await transporter.sendMail(mailOptions);

         return result;
      } catch (error) {
         return null;
      }
   }
}