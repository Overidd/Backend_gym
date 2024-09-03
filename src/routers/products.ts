import { Router } from 'express';
import type { ProductRepository } from '../interfaces/repositories/ProductRepository';

type Dependencies = {
    productRepository: ProductRepository;
}

export default function ({ productRepository }: Dependencies): Router {
    const router = Router();

    router.get('/allProducts', async (req, res) => {
        const products = await productRepository.getAll();
        if (products.length === 0) {
            res.status(404).send({ message: 'No se encontró ningún producto' });
            return;
        }

        res.send(products);
    });

    router.get('/product/:id', async (req, res) => {
        const { id } = req.params;
        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
            res.status(400).send({ message: 'El id debe ser un número' });
            return;
        }

        const product = await productRepository.getById(parsedId);

        if (!product) {
            res.status(404).send({ message: 'No se encontró ningún producto' });
            return;
        }

        res.send(product);
    })

    return router;
}