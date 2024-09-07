import type { Product, UpdateProduct, PublicProduct } from '../../products/product.types';

export interface IProductRepository {
    getAll(): Promise<Product[]>;
    getById(id: number): Promise<Product | null>;
    create(product: PublicProduct): Promise<Product>;
    update(id: number, product: UpdateProduct): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}