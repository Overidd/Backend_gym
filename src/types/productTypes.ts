import z from 'zod';
import { productSchema } from '../schemas/productSchema';

export type Product = z.infer<typeof productSchema>;
export type ProductWithoutId = Omit<Product, 'null'>;
export type ProductUpdate = Omit<ProductWithoutId, 'null'>;