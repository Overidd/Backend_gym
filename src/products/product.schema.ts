import z from 'zod';

// Validar número con hasta dos decimales y positivo
const priceVal = z.number({
    required_error: '[price] es requerido',
    invalid_type_error: '[price] debe ser un número decimal con hasta dos decimales',
}).min(0).refine(val => Math.floor(val * 100) === val * 100, {
    message: "El precio debe tener hasta dos decimales."
});

export const productSchema = z.object({
    name: z.string({
        required_error: '[name] es requerido',
        invalid_type_error: '[name] debe ser una cadena',
    }).min(1, "El nombre debe tener al menos 1 carácter").max(255, "El nombre no puede exceder los 255 caracteres"),

    description: z.string({
        required_error: '[description] es requerido',
        invalid_type_error: '[description] debe ser una cadena',
    }).min(1, "La descripción debe tener al menos 1 carácter").max(500, "La descripción no puede exceder los 500 caracteres"),

    price: priceVal,

    stock: z.number({
        required_error: '[stock] es requerido',
        invalid_type_error: '[stock] debe ser un número entero',
    }).int("El stock debe ser un número entero").min(0, "El stock no puede ser negativo"),

    isActive: z.boolean({
        invalid_type_error: '[isActive] debe ser booleano',
    }).default(true).optional(),

    imageIdsDelete: z.array(z.number({
        invalid_type_error: '[imageIdsDelete] debe ser un array de números enteros',
    })).optional(),
});

export const publicProductSchema = productSchema.pick({
    name: true,
    description: true,
    price: true,
    stock: true,
    isActive: true,
});

export const updateProductSchema = productSchema.partial();
