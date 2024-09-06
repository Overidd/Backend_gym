export class ProductEntity {

   constructor(
      public id: number,
      public name: string,
      public description: string,
      public price: number,
      public stock: number,
      public isActive: boolean,
      public images?: string[], // Arreglo de URLs de imágenes
      public createdAt?: Date | null,
      public updatedAt?: Date | null,
   ) { }

   public static fromObject(obj: { [key: string]: any }): ProductEntity {
      const { id, name, description, price, stock, isActive, createdAt, updatedAt, product_image } = obj;

      const images = product_image ? product_image.map((img: { id: number, image: string }) => {
         return {id: img.id, image: img.image}
      }) : undefined;

      return new ProductEntity(id, name, description, price, stock, isActive, images, createdAt, updatedAt);
   }
}
