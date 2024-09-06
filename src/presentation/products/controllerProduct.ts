
import { Request, Response } from 'express'
import { ProductRepository } from '../../domain/repositories'
import { CreateProductDTO, UpdateProductDTO } from '../../domain/dtos';


export class ProductController {

   constructor(
      private readonly productRepository: ProductRepository,
   ) { }

   public getAllProducts = async (_req: Request, res: Response) => {
      try {
         const products = await this.productRepository.getAll();

         res.status(200).json({
            'message': 'get all products',
            'data': products,
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
            'message': 'product created',
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

   public deleteProduct = async (req: Request, res: Response) => {
      try {
         const productId = parseInt(req.params.id)
         const result = await this.productRepository.delete(productId)

         return res.status(200).json({
            'message': 'Product deleted',
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


