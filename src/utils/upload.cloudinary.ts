// import {Express} from 'express';
import cloudinary from 'cloudinary';
import { Readable } from "stream";

export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<cloudinary.UploadApiResponse> => {

   return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
         { folder: folder }, // Opcional: especifica la carpeta en Cloudinary
         (error, result) => {
            if (error) {
               reject(error);
            } else {
               resolve(result!);
            }
         }
      );

      // Convierte el buffer a un stream y lo sube
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // Indica el final del stream
      readableStream.pipe(stream);
   });
};
