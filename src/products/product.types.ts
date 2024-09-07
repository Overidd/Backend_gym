import z from 'zod';
import { productSchema, publicProductSchema, updateProductSchema } from './product.schema';

export type Product = z.infer<typeof productSchema>;
export type PublicProduct = z.infer<typeof publicProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;