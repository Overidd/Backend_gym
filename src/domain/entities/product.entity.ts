

export class ProductEntity {

   constructor(
      public id: number,
      public name: string,
      public description: string,
      public price: number,
      public stock: number,
      public isActive: boolean,
      public createdAt: Date | null,
      public updatedAt: Date | null,
   ) { }

   public static fromObject(obj: { [key: string]: any }): ProductEntity {
      const { id, name, description, price, stock, isActive, createdAt, updatedAt } = obj;

      return new ProductEntity(id, name, description, price, stock, isActive, createdAt, updatedAt);
   }
}