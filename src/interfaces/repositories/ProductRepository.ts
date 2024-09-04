import type { Product } from '../../types/product';

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product | null>;
    create(product: Omit<Product, 'id'>): Promise<Product>;
    update(id: number, product: Partial<Product>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}