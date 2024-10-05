import type { CreateProduct, IProduct as Product, UpdateProduct } from "../products/product.DTOS";
import type { IProductRepository } from "../interfaces/repositories/ProductRepository";


/*
Ya que la mayoría de valores no tienen pérdida, voy a crear una función
para crear objetos donde sólo los valores tricky sean los probados
*/
function createProduct(price: number): CreateProduct {
    return {
        name: "Product",
        description: "Description",
        price,
        stock: 1,
        isActive: true,
    };
}

/*
También va a ser más fácil crear un repositorio de prueba así
que a fuerza de mocks (o a lo mejor no)
*/
class MockProductRepository implements IProductRepository {
    private readonly products: Product[] = [];

    constructor() {
        this.products = [];
    }
    isActiveProduct(_id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    /**
     * Este método sólo está en el repositorio para pruebas
     */
    clear(): void {
        this.products.length = 0;
    }
    
    async getAll(): Promise<Product[]> {
        return this.products;
    }

    async getById(id: number): Promise<Product | null> {
        const product = this.products.find((p) => p.id === id);
        return product || null;
    }
    
    async create(product: CreateProduct): Promise<Product> {
        const newProduct: Product = {
            id: this.products.length + 1,
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async update(id: number, product: UpdateProduct): Promise<Product | null> {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) return null;

        const updatedProduct = { ...this.products[index], ...product };
        this.products[index] = updatedProduct;
        return updatedProduct;
    }

    async delete(id: number): Promise<boolean> {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        return true;
    }
}

const mockProductRepository = new MockProductRepository();

export { mockProductRepository, createProduct };