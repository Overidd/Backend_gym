import { prisma } from "../../data/postgres";
import { CreateProductDTO, UpdateProductDTO } from "../../domain/dtos";
import { ProductEntity } from "../../domain/entities";
import { ProductDatasource } from "../../domain/datasources";


export class ProductDatasourceImpl implements ProductDatasource {
   async getAll(): Promise<ProductEntity[]> {
      const products = await prisma.product.findMany({
         where: { isActive: true },
         include: {
            product_image: true,
         }
         // orderBy: { createdAt: "desc" },
         // take: 10,
      });
      return products.map((item) => ProductEntity.fromObject(item));
   }

   async getById(id: number): Promise<ProductEntity | null> {
      const product = await prisma.product.findUnique({
         where: { id },
         include: {
            product_image: true,
         }
      });

      if (product?.isActive === false) throw 'Producto desactivado';

      if (!product) throw 'Producto no encontrado';

      return ProductEntity.fromObject(product);
   }
   async create(product: CreateProductDTO): Promise<ProductEntity> {

      const createdProduct = await prisma.$transaction(async (prisma) => {

         const newProduct = await prisma.product.create({
            data: {
               name: product.name,
               description: product.description,
               price: product.price,
               stock: product.stock,
               isActive: product.isActive,
            },
         });

         // Guarda nuevas imágenes
         if (product.images != undefined && product.images?.length > 0) {
            await prisma.product_image.createMany({
               data: product.images.map((image) => ({
                  image: image,
                  product_id: newProduct.id,
               })),
            });
         }

         return newProduct
      })


      return ProductEntity.fromObject(createdProduct);
   }
   async update(id: number, product: UpdateProductDTO): Promise<ProductEntity | null> {

      await this.getById(id);

      const updatedProduct = await prisma.$transaction(async (prisma) => {
         const updatedproduct = await prisma.product.update({
            where: { id },
            data: {
               name: product.name,
               description: product.description,
               price: product.price,
               stock: product.stock,
               isActive: product.isActive,
            },
         });

         // Para eliminar las imágenes específicas
         if (product.imageIdsDelete && product.imageIdsDelete.length > 0) {
            await prisma.product_image.deleteMany({
               where: {
                  id: { in: product.imageIdsDelete },
                  product_id: id,
               },
            });
         }

         // Guarda nuevas imágenes
         if (product.images && product.images.length > 0) {
            await prisma.product_image.createMany({
               data: product.images.map((image) => ({
                  image: image,
                  product_id: id,
               })),
            });
         }

         return updatedproduct;
      });

      if (!updatedProduct) {
         throw new Error('Error al actualizar el producto');
      }
      return ProductEntity.fromObject(updatedProduct);
   }
   async delete(id: number): Promise<boolean> {
      await this.getById(id)

      const updatedProduct = await prisma.product.update({
         where: { id },
         data: {
            isActive: false,
         },
      });

      if (!updatedProduct) {
         throw 'Error al eliminar el producto'
      }
      return true
   }
} 