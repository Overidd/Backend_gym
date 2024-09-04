import z from 'zod';
import { productSchema } from '../schemas/product';

export type Product = z.infer<typeof productSchema>;