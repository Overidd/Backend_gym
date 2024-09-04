import type { Product, ProductUpdate, ProductWithoutId } from '../../types/productTypes';

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product | null>;
    create(product: ProductWithoutId): Promise<Product>;
    update(id: number, product: Partial<ProductUpdate>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}