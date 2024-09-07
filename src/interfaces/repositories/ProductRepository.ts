import type { IProduct, UpdateProductDTO, CreateProductDTO } from '../../products/product.DTOS';

export interface IProductRepository {
    getAll(): Promise<IProduct[]>;
    getById(id: number): Promise<IProduct | null>;
    create(product: CreateProductDTO): Promise<IProduct>;
    update(id: number, product: UpdateProductDTO): Promise<IProduct | null>;
    delete(id: number): Promise<boolean>;
}