
import qrcode from 'qrcode';

export class QrCode {
   static generateQrCode = async (codeLength = 4): Promise<{ qrCode: any, code: string }> => {
      let num = '1'
      for (let i = 0; i < codeLength; i++) {
         num += 0
      }
      const randomNumber = Math.floor(Math.random() * parseInt(num));
      const qrCodeData = randomNumber.toString();

      // Generar QR en formato SVG
      const qrCode  = await qrcode.toBuffer(qrCodeData);

      return {
         qrCode: qrCode,
         code: qrCodeData,
      }
   }
}