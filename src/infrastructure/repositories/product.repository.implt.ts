import { CreateProductDTO, UpdateProductDTO } from "../../domain/dtos";
import { ProductEntity } from "../../domain/entities";
import { ProductDatasource } from "../../domain/datasources";
import { ProductRepository } from "../../domain/repositories";


export class ProductRespositoryImpl implements ProductRepository {
   constructor(
      private readonly datasource: ProductDatasource,
   ) { }

   getAll(): Promise<ProductEntity[]> {
      return this.datasource.getAll()
   }
   getById(id: number): Promise<ProductEntity | null> {
      return this.datasource.getById(id)
   }
   create(product: CreateProductDTO): Promise<ProductEntity> {
      return this.datasource.create(product)
   }
    update(id: number, product: UpdateProductDTO): Promise<ProductEntity | null> {
      return this.datasource.update(id, product)
   }
   delete(id: number): Promise<boolean> {
      return this.datasource.delete(id)
   }

}