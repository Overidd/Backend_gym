export interface HandlerImage {
   uploadImage(file: Express.Multer.File, folder: string): Promise<string>;
   uploadImages(files: Express.Multer.File[], folder: string): Promise<string[]>
   publicId(url: string): string | null;
   deleteImage(url: string): Promise<boolean>;
}  