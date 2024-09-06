import z from 'zod';

// Validación del precio
const priceVal = z.number().min(0).refine((value) => !Number.isInteger(value), {
   message: 'El precio debe ser un número decimal válido.',
});

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

export type Product = z.infer<typeof productSchema>;
export type ProductBody = Omit<Product, 'id'>;

export class CreateProductDTO {
   constructor(
      public readonly name: string,
      public readonly description: string,
      public readonly price: number,
      public readonly stock: number,
      public readonly isActive: boolean,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
   ) { }

   static create(props: ProductBody): [string?, CreateProductDTO?] {
      try {
         // Validar los datos usando Zod
         const validatedProps = productSchema.omit({ id: true }).parse(props);

         // Si todo es correcto, crear la instancia
         const { name, description, price, stock, isActive, createdAt, updatedAt } = validatedProps;

         return [undefined, new CreateProductDTO(name, description, price, stock, isActive, createdAt, updatedAt)];

      } catch (error) {
         // Capturar y retornar el error de Zod
         if (error instanceof z.ZodError) {
            return [error.errors.map(e => e.message).join(', '), undefined];
         }
         return ['Error inesperado', undefined];
      }
   }
}
