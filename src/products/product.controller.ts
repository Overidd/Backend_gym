import { IProductRepository } from "../interfaces/repositories/ProductRepository";
import type { Request, Response } from 'express';

export class ProductController {
    private readonly productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    getAll = async (req: Request, res: Response) => {
        const products = await this.productRepository.getAll();
        if (products.length === 0) {
            res.status(404).send({ message: 'No se encontró ningún producto' });
            return;
        }

        res.send(products);
    }

    getById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).send({ message: 'El id debe ser un número' });
            return;
        }

        const product = await this.productRepository.getById(id);

        if (!product) {
            res.status(404).send({ message: 'No se encontró ningún producto' });
            return;
        }

        res.send(product);
    }
}