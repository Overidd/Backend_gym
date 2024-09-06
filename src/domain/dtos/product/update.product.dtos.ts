import z from 'zod';

// Validación del precio, que permite solo números decimales válidos
const priceVal = z.number().min(0).refine((value) => !Number.isInteger(value), {
   message: 'El precio debe ser un número decimal válido.',
});

// Esquema del producto original
export const productSchema = z.object({
   id: z.number().int(),
   name: z.string().min(1).max(255),
   description: z.string().min(1).max(500),
   price: priceVal,
   stock: z.number().int().min(0),
   isActive: z.boolean().default(true),
   createdAt: z.date(),
   updatedAt: z.date(),
});

// Esquema para actualizar producto donde todos los campos son opcionales
export const updateProductSchema = productSchema.partial();

export type Product = z.infer<typeof productSchema>;
export type ProductUpdateBody = Partial<Omit<Product, 'id'>>;

export class UpdateProductDTO {

   constructor(
      public readonly name?: string,
      public readonly description?: string,
      public readonly price?: number,
      public readonly stock?: number,
      public readonly isActive?: boolean,
      public readonly createdAt?: Date,
      public readonly updatedAt?: Date,
   ) { }

   static update(props: ProductUpdateBody): [string?, UpdateProductDTO?] {
      try {
         // Validar los datos de actualización usando el esquema opcional
         const { name, description, price, stock, isActive, createdAt, updatedAt } = updateProductSchema.parse(props);

         // Crear una instancia de UpdateProductDTO con los datos validados
         return [undefined, new UpdateProductDTO(name, description, price, stock, isActive, createdAt, updatedAt
         )];

      } catch (error) {
         // Capturar y retornar el error de Zod
         if (error instanceof z.ZodError) {
            return [error.errors.map(e => e.message).join(', '), undefined];
         }
         return ['Error inesperado', undefined];
      }
   }
}
