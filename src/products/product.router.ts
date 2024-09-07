import type { IProductRepository } from '../interfaces/repositories';
import { ProductController } from './product.controller';
import { Router } from 'express';
import { ProductRepository } from './productRepository'
import multer from 'multer';


// Configura de multer temporal
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'images-temp/');
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

export class ProductRouter {
    private readonly productRepositoryExter?: IProductRepository

    constructor(productRepositoryExter?: IProductRepository) {
        this.productRepositoryExter = productRepositoryExter;
    }

    public get router(): Router {
        const productRepository = new ProductRepository()

        const router = Router();
        const controller = new ProductController(this.productRepositoryExter || productRepository)

        router.get('/all', controller.getAllProducts);
        router.get('/:id', controller.getProductById)
        router.post('/create', upload.array('image', 10), controller.createProduct);
        router.put('/update/:id', upload.array('image', 10), controller.updateProduct);
        router.delete('/delete/:id', controller.deleteProduct);

        return router;
    }
}