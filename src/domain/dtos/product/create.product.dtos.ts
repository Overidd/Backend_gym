import z from 'zod';
import { ProductCreate, productSchema } from './chesma.producto';


export class CreateProductDTO {
   constructor(
      public readonly name: string,
      public readonly description: string,
      public readonly price: number,
      public readonly stock: number,
      public readonly isActive: boolean,
      public readonly images?: string[],
   ) { }

   static create(props: ProductCreate, images?: string[]): [string?, CreateProductDTO?] {
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
         const validatedImages = images?.length ? images : undefined;

         // Validar los datos usando Zod
         const validatedProps = productSchema.parse(props);

         // Si todo es correcto, crear la instancia
         const { name, description, price, stock, isActive } = validatedProps;

         return [undefined, new CreateProductDTO(name, description, price, stock, isActive, validatedImages)];

      } catch (error) {
         if (error instanceof z.ZodError) {
            return [error.errors.map(e => e.message).join(', '), undefined];
         }
         return ['Error inesperado', undefined];
      }
   }
}
