import { Router } from 'express';
import { ProductRespositoryImpl } from '../../infrastructure/repositories/product.repository.implt';
import { ProductDatasourceImpl } from '../../infrastructure/datasource/product.datasource.impl';
import { ProductController } from './controllerProduct';
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

    static get router(): Router {
        const router = Router();

        const datasource = new ProductDatasourceImpl()
        const productRepository = new ProductRespositoryImpl(datasource)
        const productController = new ProductController(productRepository)

        router.get('/all', productController.getAllProducts);
        router.get('/:id', productController.getProductById)
        router.post('/create', upload.array('image', 10), productController.createProduct);
        router.put('/update/:id', upload.array('image', 10), productController.updateProduct);
        router.delete('/delete/:id', productController.deleteProduct);

        return router;
    }
}
