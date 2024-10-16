import { IProductRepository } from "../../interfaces/repositories/ProductRepository";
import { ProductRepository, CreateProductDTO, UpdateProductDTO } from '.';
import type { Request, Response } from 'express';


type queryString = {
    page?: string;
    pagesize?: string;
    order?: 'asc' | 'desc';
}

export class ProductController {
    constructor(
        private readonly productRepository: IProductRepository,
    ) { }

    public getAllProducts = async (req: Request, res: Response) => {
        // Paginacion 
        let { page = '1', pagesize = '10', order = 'asc' }: queryString = req.query;

        if (order != 'desc') {
            order = 'asc'
        }

        const skitp: number = (parseInt(page) - 1) * parseInt(pagesize)

        try {
            const products = await this.productRepository.getAll(skitp, parseInt(pagesize));

            const newProductsOrder = products.sort((a, b) => {
                if (order === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });


            res.status(200).json({
                'message': 'get all products',
                'data': newProductsOrder,
            })

        } catch (error) {
            res.status(500).json({
                'message': 'Error getting products',
                'error': error
            })
        }
    }

    public getProductById = async (req: Request, res: Response) => {
        try {
            const productId = parseInt(req.params.id)
            const product = await this.productRepository.getById(productId)

            res.status(200).json({
                'message': 'get product by id',
                'data': product
            })
        } catch (error) {
            if (error instanceof ProductRepository) {
                return res.status(404).json({
                    'message': 'Product not found',
                    'error': error
                })
            }

            return res.status(500).json({
                'message': 'Error getting product',
                'error': error
            })
        }
    }
    public createProduct = async (req: Request, res: Response) => {
        try {
            const images = req.files as Express.Multer.File[];
            const pathImages = images.map(file => file.path)

            const [error, updateTodoDto] = CreateProductDTO.create(req.body, pathImages)

            if (error) {
                return res.status(400).json({
                    'message': 'Error creating product',
                    'error': error
                })
            }
            const product = await this.productRepository.create(updateTodoDto!)

            res.status(201).json({
                'message': 'Product created successfully',
                'data': product
            })

        } catch (error) {
            if (error instanceof ProductRepository) {
                return res.status(404).json({
                    'message': 'Invalid product data',
                    'error': error
                })
            }
            return res.status(500).json({
                'message': 'Error getting product',
                'error': error
            })
        }
    }

    public updateProduct = async (req: Request, res: Response) => {
        try {
            const productId = parseInt(req.params.id)
            const images = req.files as Express.Multer.File[];
            const pathImages = images.map(file => file.path)
            //? Mas adelante se deberia conectar en https://cloudinary.com/


            const [error, updateTodoDto] = UpdateProductDTO.update(req.body, pathImages)
            if (error) {
                return res.status(400).json({
                    'message': 'Error updating product',
                    'error': error
                })
            }

            const product = await this.productRepository.update(productId, updateTodoDto!)

            return res.status(200).json({
                'message': 'product updated',
                'data': product
            })

        } catch (error) {
            if (error instanceof ProductRepository) {
                return res.status(404).json({
                    'message': 'Invalid product data',
                    'error': error
                })
            }
            return res.status(500).json({
                'message': 'Error getting product',
                'error': error
            })
        }
    }

    public isActiveProduct = async (req: Request, res: Response) => {
        try {
            const productId = parseInt(req.params.id)
            const result = await this.productRepository.isActiveProduct(productId)

            let message = ''

            if (result === true) {
                message = 'Producto activado'
            } else {
                message = 'Producto desactivado'
            }

            return res.status(200).json({
                'message': message,
                'data': result
            })

        } catch (error) {
            if (error instanceof ProductRepository) {
                return res.status(404).json({
                    'message': 'Invalid product data',
                    'error': error
                })
            }
            return res.status(500).json({
                'message': 'Error getting product',
                'error': error
            })
        }
    }
}


