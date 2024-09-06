import { Router } from 'express';
import { ProductRespositoryImpl } from '../../infrastructure/repositories/product.repository.implt';
import { ProductDatasourceImpl } from '../../infrastructure/datasource/product.datasource.impl';
import { ProductController } from './controllerProduct';

export default function productRouter() {
    const router = Router();

    const datasource = new ProductDatasourceImpl()
    const productRepository = new ProductRespositoryImpl(datasource)
    const productController = new ProductController(productRepository)

    router.get('/all', productController.getAllProducts);
    router.get('/:id', productController.getProductById)
    router.post('/create', productController.createProduct);
    router.put('/update/:id', productController.updateProduct);
    router.delete('/delete/:id', productController.deleteProduct);

    return router;
}
