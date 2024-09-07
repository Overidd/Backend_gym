import { Router } from 'express';
import type { IProductRepository } from '../interfaces/repositories/ProductRepository.js';
import { ProductController } from './product.controller.js';

type Dependencies = {
    productRepository: IProductRepository;
}

export default function ({ productRepository }: Dependencies): Router {
    const router = Router();
    const controller = new ProductController(productRepository)

    router.get('/all', controller.getAll);
    router.get('/:id', controller.getById)

    return router;
}