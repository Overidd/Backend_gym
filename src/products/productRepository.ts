import { prisma } from "../data/postgres";
import { IProductRepository } from "../interfaces/repositories";
import { IProduct, CreateProductDTO, UpdateProductDTO } from ".";


export class ProductRepository implements IProductRepository {
   async getAll(skitp: number, pagesize: number): Promise<IProduct[]> {
      // se Obtiene todo la informacion de la tabla product
      const products = await prisma.product.findMany({
         skip: skitp,
         take: pagesize,
         where: { isActive: true },
         include: {
            product_image: {
               select: {
                  id: true,
                  image: true
               }
            },
         },
         orderBy: { id: 'asc' },

      });
      return products

   }
   async getById(id: number): Promise<IProduct | null> {

      // se obtiene la informacion del producto por el id
      // Se incluye la relacion con las imagenes del producto
      const product = await prisma.product.findUnique({
         where: { id },
         include: {
            product_image: true,
         }
      });

      // Si el producto no está activo, se lanza una excepción
      if (product?.isActive === false) throw 'Producto desactivado';

      // Si no se encuentra el producto, se lanza una excepción
      if (!product) throw 'Producto no encontrado';

      return product
   }
   async create(product: CreateProductDTO): Promise<IProduct> {

      //El método $transaction() en Prisma permite agrupar varias operaciones de la base de datos. Esto es útil cuando necesitas realizar varias operaciones relacionadas, y de asegurarte de que todas se completen correctamente, si ocurre alguna falla, se revertir todos los datos, de esa forma nos aseguramos de no guardar data basura.
      const createdProduct = await prisma.$transaction(async (prisma) => {

         // Crea el producto un producto
         const newProduct = await prisma.product.create({
            data: {
               name: product.name,
               description: product.description,
               price: product.price,
               stock: product.stock,
               isActive: product.isActive,

            },
         });

         // Guarda nuevas imágenes en la tabla (producto_imagen)
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
   async isActiveProduct(id: number): Promise<boolean> {

      const isActiveProduct = await prisma.product.findUnique({
         where: { id }
      });
      if (!isActiveProduct) {
         throw 'No existe el producto'
      }

      const updatedProduct = await prisma.product.update({
         where: { id },
         data: {
            isActive: !isActiveProduct?.isActive,
         },
      })

      if (!updatedProduct) {
         throw 'Error al eliminar el producto'
      }
      if (updatedProduct.isActive === true) return true;
      return false

   }

}