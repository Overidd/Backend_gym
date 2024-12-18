import { cloudinary } from '../config/cloudinary.config';
import { Readable } from "stream";
// import { ErrorUploadImage } from '../utils';
import { HandleImage } from '../interfaces';

export class Cloudinary implements HandleImage {
   constructor(
      private readonly isUploadImage: boolean
   ) { }

   public uploadImage = (file: Express.Multer.File, folder: string): Promise<string> => {
      return new Promise((resolve, reject) => {
         try {
            if (!this.isUploadImage) return resolve(file?.originalname || 'imagen sin nombre');

            const stream = cloudinary.uploader.upload_stream({ folder: folder },
               (error, result) => {
                  if (error) return reject(new Error(`Error del servidor al subir la imagen`));
                  resolve(result?.secure_url || 'Error: URL no disponible');
               });

            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
            readableStream.pipe(stream);

         } catch (error) {
            throw new Error('Error inesperado al subir la imagen');
         }
      });
   };

   public uploadImages = (files: Express.Multer.File[], folder: string): Promise<string[]> => {
      return Promise.all(
         files.map(async (image) => {
            const imageCloudinary = await this.uploadImage(image, folder);
            return imageCloudinary;
         })
      );
   }


   public publicId = (url: string): string | null => {
      const urlParts = url.split('/');
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      const publicId = fileNameWithExtension.split('.')[0];
      const folderPath = urlParts.slice(urlParts.indexOf('upload') + 1, urlParts.length - 1).join('/');

      return `${folderPath.split('/')[1]}/${publicId}`;
   }

   public deleteImage = (url: string): Promise<boolean> => {
      return new Promise((resolve, _reject) => {
         if (!url) {
            resolve(false);
         }
         const publicId = this.publicId(url);

         cloudinary.uploader.destroy(publicId!, (error, _result) => {
            if (error) {
               resolve(false);
            } else {
               resolve(true);
            }
         });
      });
   }
}
