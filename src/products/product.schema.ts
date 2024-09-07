import z from 'zod';

// número entero o decimal con 2 dígitos en la parte decimal
// No he encontrado una forma mejor de implementarlo con Zod
const priceVal = z.number().min(0).multipleOf(0.01);

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

export const publicProductSchema = productSchema.pick({
    name: true,
    description: true,
    price: true,
    stock: true,
    isActive: true,
});

export const updateProductSchema = publicProductSchema.partial();