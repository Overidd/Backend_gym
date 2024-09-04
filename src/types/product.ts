import z from 'zod';
import { productSchema } from '../schemas/product';

export type Product = z.infer<typeof productSchema>;
export type ProductWithoutId = Omit<Product, 'id'>;
export type ProductUpdate = Omit<ProductWithoutId, 'disabled'>;