import { prisma } from "../../data/postgres";
import { CreateProductDTO, UpdateProductDTO } from "../../domain/dtos";
import { ProductEntity } from "../../domain/entities";
import { ProductDatasource } from "../../domain/datasources";


export class ProductDatasourceImpl implements ProductDatasource {
   async getAll(): Promise<ProductEntity[]> {
      const products = await prisma.product.findMany();
      return products.map(ProductEntity.fromObject(products));
   }

   async getById(id: number): Promise<ProductEntity | null> {
      const product = await prisma.product.findUnique({ where: { id } });

      if (!product) {
         throw 'Producto no encontrado'
      }

      return ProductEntity.fromObject(product);
   }
   async create(product: CreateProductDTO): Promise<ProductEntity> {
      const createdProduct = await prisma.product.create({
         data: product,
      });

      return ProductEntity.fromObject(createdProduct);
   }
   async update(id: number, product: UpdateProductDTO): Promise<ProductEntity | null> {

      await this.getById(id)

      const updatedProduct = await prisma.product.update({
         where: { id },
         data: product,
      });

      if (!updatedProduct) {
         throw 'Error al actualizar el product'
      }

      return ProductEntity.fromObject(updatedProduct);

   }
   async delete(id: number): Promise<boolean> {
      await this.getById(id)

      const updatedProduct = await prisma.product.update({
         where: { id },
         data: {
            status: false,
         },
      });

      if (!updatedProduct) {
         throw 'Error al eliminar el producto'
      }
      return true

   }

}