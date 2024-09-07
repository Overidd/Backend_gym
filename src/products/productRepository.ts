import { prisma } from "../data/postgres";
import { IProductRepository } from "../interfaces/repositories";
import { IProduct, CreateProductDTO, UpdateProductDTO } from "./product.DTOS";

export class ProductRepository implements IProductRepository {
   async getAll(): Promise<IProduct[]> {
      const products = await prisma.product.findMany({
         where: { isActive: true },
         include: {
            product_image: {
               select:{
                  id: true,
                  image: true
               }
            },
         },
         orderBy: { createdAt: "asc" },
         // take: 10,
      });
      return products
   }
   async getById(id: number): Promise<IProduct | null> {
      const product = await prisma.product.findUnique({
         where: { id },
         include: {
            product_image: true,
         }
      });

      if (product?.isActive === false) throw 'Producto desactivado';

      if (!product) throw 'Producto no encontrado';

      return product
   }
   async create(product: CreateProductDTO): Promise<IProduct> {

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
      return createdProduct
   }
   async update(id: number, product: UpdateProductDTO): Promise<IProduct | null> {
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
      return updatedProduct;
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