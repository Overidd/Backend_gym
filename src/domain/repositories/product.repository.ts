import { CreateProductDTO } from "../dtos";
import { UpdateProductDTO } from "../dtos/product/update.product.dtos";
import { ProductEntity } from "../entities";


export abstract class ProductRepository {
   abstract getAll(): Promise<ProductEntity[]>;
   abstract getById(id: number): Promise<ProductEntity | null>;
   abstract create(product: CreateProductDTO): Promise<ProductEntity>;
   abstract update(id: number, product:UpdateProductDTO): Promise<ProductEntity | null>;
   abstract delete(id: number): Promise<boolean>;
} 