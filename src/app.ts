import express from 'express';
import cors from 'cors';

import { IProductRepository } from './interfaces/repositories/ProductRepository';
import createProductRouter from './products/product.router.js';

type Dependencies = {
    productRepository: IProductRepository;
}

export default function ({ productRepository }: Dependencies): express.Express {
    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());
    app.use(cors());
    app.use('/api/product', createProductRouter({ productRepository }));

    return app;
}
