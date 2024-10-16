import type { IProduct, UpdateProductDTO, CreateProductDTO } from '../../presentation/products';

export interface IProductRepository {
    getAll(skitp: number, pagesize: number): Promise<IProduct[]>;
    getById(id: number): Promise<IProduct | null>;
    create(product: CreateProductDTO): Promise<IProduct>;
    update(id: number, product: UpdateProductDTO): Promise<IProduct | null>;
    isActiveProduct(id: number): Promise<boolean>;
}