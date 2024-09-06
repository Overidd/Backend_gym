import z from 'zod';
import { ProductUpdateBody, updateProductSchema } from './chesma.producto';

export class UpdateProductDTO {

   constructor(
      public readonly name?: string,
      public readonly description?: string,
      public readonly price?: number,
      public readonly stock?: number,
      public readonly isActive?: boolean,
      public readonly imageIdsDelete?: number[],
      public readonly images?: string[],
   ) { }


   static get produc() {
      return updateProductSchema;
   }
   static update(props: ProductUpdateBody, images?: string[]): [string?, UpdateProductDTO?] {
      try {

         if (typeof props.price === 'string') {
            props.price = parseFloat(props.price);
         }

         if (typeof props.stock === 'string') {
            props.stock = parseInt(props.stock, 10);
         }

         if (typeof props.imageIdsDelete === 'string') {
            props.imageIdsDelete = JSON.parse(props.imageIdsDelete);
         }

         // Verificar image
         const validatedImages = images?.length ? images : undefined;
         
         // Validar los datos de actualización usando el esquema 
         const { name, description, price, stock, isActive, imageIdsDelete } = updateProductSchema.parse(props);

         return [undefined, new UpdateProductDTO(name, description, price, stock, isActive, imageIdsDelete, validatedImages
         )];

      } catch (error) {
         if (error instanceof z.ZodError) {
            return [error.errors.map(e => e.message).join(', '), undefined];
         }
         return ['Error inesperado', undefined];
      }
   }
}
