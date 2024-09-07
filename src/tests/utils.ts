import type { IProduct as Product, CreateProduct as PublicProduct, UpdateProduct } from "../products/product.DTOS";
import type { IProductRepository } from "../interfaces/repositories/ProductRepository";


/*
Ya que la mayoría de valores no tienen pérdida, voy a crear una función
para crear objetos donde sólo los valores tricky sean los probados
*/
function createProduct(price: number): Product {
    return {
        id: 1,
        name: "Product",
        description: "Description",
        price,
        stock: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

/*
También va a ser más fácil crear un repositorio de prueba así
que a fuerza de mocks
*/
class MockProductRepository implements IProductRepository {
    private readonly products: Product[] = [];

    constructor() {
        this.products = [];
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
    
    async create(product: PublicProduct): Promise<Product> {
        const newProduct: Product = {
            id: this.products.length + 1, ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false,
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