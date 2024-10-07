import z from 'zod';
import { productSchema, publicProductSchema, updateProductSchema } from './product.schema';

export type CreateProduct = z.infer<typeof publicProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

//* Formato de la respuesta para el cliente
export interface IProduct {
   id: number;
   name: string;
   description: string;
   price: number;
   stock: number;
   isActive: boolean;
   created_at: Date | undefined;
   updated_at: Date | undefined;
   image?: string[] | undefined;
}

const parseInput = (props: any) => {

   if (typeof props.price === 'string') {
      props.price = parseFloat(props.price)
   };
   if (typeof props.stock === 'string') {
      props.stock = parseInt(props.stock, 10)
   };
   if (typeof props.imageIdsDelete === 'string') {
      props.imageIdsDelete = JSON.parse(props.imageIdsDelete)
   };

   return props;
}

//* DTO para creación de los productos
export class CreateProductDTO {
   constructor(
      public readonly name: string,
      public readonly description: string,
      public readonly price: number,
      public readonly stock: number,
      public readonly isActive?: boolean,
      public readonly images?: string[],
   ) { }

   static create(props: CreateProduct, images?: string[]): [string[]?, CreateProductDTO?] {
      try {
         // Parsear data que viene el doby
         const parsedProps = parseInput(props);

         const validatedProps = productSchema.parse(parsedProps);

         const { name, description, price, stock, isActive } = validatedProps;

         // Verificar image
         const validatedImages = images?.length ? images : undefined;

         return [undefined, new CreateProductDTO(name, description, price, stock, isActive, validatedImages)];

      } catch (error) {
         if (error instanceof z.ZodError) {
            return [[error.errors.map(e => e.message).join(', ')], undefined];
         }
         return [['Error inesperado'], undefined];
      }
   }
}

//* DTO para actualizar un producto
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

   static update(props: UpdateProduct, images?: string[]): [string?, UpdateProductDTO?] {
      try {
         // Parsear
         const parsedProps = parseInput(props);

         const validatedProps = updateProductSchema.parse(parsedProps);

         const { name, description, price, stock, isActive, imageIdsDelete } = validatedProps;

         // Verificar image
         const validatedImages = images?.length ? images : undefined;

         return [undefined, new UpdateProductDTO(name, description, price, stock, isActive, imageIdsDelete, validatedImages)];

      } catch (error) {
         if (error instanceof z.ZodError) {
            return [error.errors.map(e => e.message).join(', '), undefined];
         }
         return ['Error inesperado', undefined];
      }
   }
}
