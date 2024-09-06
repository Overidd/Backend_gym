import z from 'zod';

// Validación del precio
// const priceVal = z.number().min(0).refine((value) => !Number.isInteger(value), {
//    message: 'El precio debe ser un número decimal válido.',
// });

export const productSchema = z.object({
   name: z.string().min(1).max(255),
   description: z.string().min(1).max(500),
   price: z.number().min(0),
   stock: z.number().int().min(0).default(1),
   isActive: z.boolean().default(true),
   imageIdsDelete: z.array(z.number()).optional()  
});

export type Product = z.infer<typeof productSchema>;
export type ProductCreate = Omit<Product, 'null'>;

export const updateProductSchema = productSchema.partial();
export type ProductUpdateBody = Partial<Omit<Product, 'null'>>;
