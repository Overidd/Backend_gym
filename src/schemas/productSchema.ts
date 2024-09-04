import z from 'zod';

// Zod no tiene algo como `z.number().float()` para esto
// TO FIX: FALLA CON NÚMEROS CON PARTE DECIMAL 0
// 6.0, 81.0...
const priceVal = z.number().min(0).refine((value) => !Number.isInteger(value));

export const productSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(500),
    price: priceVal,
    stock: z.number().int().min(0),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});