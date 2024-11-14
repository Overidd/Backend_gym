import { Resend } from 'resend';
import ejs from 'ejs';
import path from 'path';
import { envs } from '../config';
import { IPayloadSendEmail } from './email';

const resend = new Resend(envs.resend_api_key);

export class EmailResend {
   static async sendEmailmembers(payload: IPayloadSendEmail): Promise<any | null> {
      const templatePath = path.join(__dirname, `../templates/${payload.pathHtml}`);

      const htmlContent = await ejs.renderFile(templatePath, {...payload,});

      const { data, error } = await resend.emails.send({
         from: 'Gym <onboarding@resend.dev>',
         to: [payload.email],
         subject: 'Bienvenido ' + payload.name,
         html: htmlContent,

         attachments: [
            {
               filename: 'qrcode.png',
               content: payload.qrCode,
               contentType: 'image/png',
            },
         ],
      });
      if (error) {
         return null
      }
      return data
   }
}


// let htmlContent = fs.readFileSync(templatePath, 'utf8');
// const templatePath = path.join('src', 'templates/email.subcription.user.html');

// for (const [key, value] of Object.entries(payload)) {
//    htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
// }
      
// const base64SVG = Buffer.from(payload.qrCode).toString('base64');

// const svgBase64Image = `data:image/svg+xml;base64,${base64SVG}`;