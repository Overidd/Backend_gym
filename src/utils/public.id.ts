export const extractPublicIdFromUrl = (url: string): string | null => {

   try {
      const urlParts = url.split('/');
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      const publicId = fileNameWithExtension.split('.')[0];
      const folderPath = urlParts.slice(urlParts.indexOf('upload') + 1, urlParts.length - 1).join('/');
      
      return `${folderPath.split('/')[1]}/${publicId}`;

   } catch (error) {
      throw Error('Error inesperado');
   }
}