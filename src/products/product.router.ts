import type { IProductRepository } from '../interfaces/repositories';
import { ProductController, ProductRepository } from '.';
import multer from 'multer';
import { Router } from 'express';

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

        /**
         * @swagger
         * /api/v1/product/all:
         *   get:
         *     summary: Obtiene todos los productos activos
         *     description: Retorna una lista de productos activos.
         *     tags:
         *       - Product
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 2
         *         description: Número de página a solicitar. Por defecto es 1.
         *       - in: query
         *         name: pagesize
         *         schema:
         *           type: integer
         *           example: 4
         *         description: Cantidad de productos por página. Por defecto es 10.
         *       - in: query
         *         name: order
         *         schema:
         *           type: string
         *           enum: [asc, desc]
         *           example: asc   
         *         description: Orden de los productos, puede ser ascendente (asc) o descendente (desc). Por defecto es asc.
         *     responses:
         *       200:
         *         description: Lista de productos obtenida correctamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "get all products"
         *                 data:
         *                   type: array
         *                   items:
         *                     type: object
         *                     example:
         *                       id: 1
         *                       name: "Camiseta Deportiva"
         *                       description: "Camiseta de poliéster para deportes"
         *                       price: 29.99
         *                       stock: 100
         *                       isActive: true
         *                       createdAt: "2024-09-01T10:00:00Z"
         *                       updatedAt: "2024-09-05T12:00:00Z"
         *                       image: ["imagen1.jpg", "imagen2.jpg"]
         *       404:
         *         description: No se encontraron productos activos
         *       500:
         *         description: Error interno del servidor
         */
        router.get('/all', controller.getAllProducts);

        /**
         * @swagger
         * /api/v1/product/{id}:
         *   get:
         *     summary: Obtiene un producto por ID
         *     description: Retorna un producto específico basado en su ID.
         *     tags:
         *       - Product
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID del producto a obtener
         *         schema:
         *           type: integer
         *           example: 1
         *     responses:
         *       200:
         *         description: Producto obtenido correctamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "get product by id"
         *                 data:
         *                   type: object
         *                   example:
         *                     id: 1
         *                     name: "Camiseta Deportiva"
         *                     description: "Camiseta de poliéster para deportes"
         *                     price: 29.99
         *                     stock: 100
         *                     isActive: true
         *                     createdAt: "2024-09-01T10:00:00Z"
         *                     updatedAt: "2024-09-05T12:00:00Z"
         *                     image: ["imagen1.jpg", "imagen2.jpg"]
         *       404:
         *         description: Producto no encontrado
         *       500:
         *         description: Error interno del servidor
         */
        router.get('/:id', controller.getProductById)

        /**
         * @swagger
         * /api/v1/product/create:
         *   post:
         *     summary: Crea un nuevo producto
         *     description: Crea un nuevo producto en la base de datos.
         *     tags:
         *       - Product
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Camiseta Deportiva"
         *                 description: Nombre del producto
         *               description:
         *                 type: string
         *                 example: "Camiseta de poliéster para deportes"
         *                 description: Descripción del producto
         *               price:
         *                 type: number
         *                 format: float
         *                 example: 29.99
         *                 description: Precio del producto
         *               stock:
         *                 type: integer
         *                 example: 100
         *                 description: Cantidad en stock
         *               isActive:
         *                 type: boolean
         *                 example: true
         *                 description: Indica si el producto está activo (opcional)
         *               image:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Imágenes del producto
         *     responses:
         *       201:
         *         description: Producto creado exitosamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Product created successfully"
         *                 data:
         *                   type: object
         *                   example:
         *                     id: 1
         *                     name: "Camiseta Deportiva"
         *                     description: "Camiseta de poliéster para deportes"
         *                     price: 29.99
         *                     stock: 100
         *                     isActive: true
         *                     createdAt: "2024-09-01T10:00:00Z"
         *                     updatedAt: "2024-09-05T12:00:00Z"
         *                     image: ["imagen1.jpg", "imagen2.jpg"]
         *       400:
         *         description: Datos inválidos o error en la solicitud
         *       500:
         *         description: Error interno del servidor
         */

        router.post('/create', upload.array('image', 10), controller.createProduct);

        /**
         * @swagger
         * /api/v1/product/update/{id}:
         *   put:
         *     summary: Actualiza un producto existente
         *     description: Actualiza un producto específico basado en su ID. Permite modificar algunos campos y manejar imágenes.
         *     tags:
         *       - Product
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID del producto a actualizar
         *         schema:
         *           type: integer
         *           example: 1
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Camiseta Deportiva"
         *                 description: Nombre del producto (opcional)
         *               description:
         *                 type: string
         *                 example: "Camiseta de poliéster para deportes"
         *                 description: Descripción del producto (opcional)
         *               price:
         *                 type: number
         *                 format: float
         *                 example: 29.99
         *                 description: Precio del producto (opcional)
         *               stock:
         *                 type: integer
         *                 example: 100
         *                 description: Cantidad en stock (opcional)
         *               isActive:
         *                 type: boolean
         *                 example: true
         *                 description: Indica si el producto está activo (opcional)
         *               imageIdsDelete:
         *                 type: array
         *                 items:
         *                   type: integer
         *                 example: [1, 2]
         *                 description: IDs de imágenes a eliminar (opcional)
         *               images:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Nuevas imágenes para el producto (opcional)
         *     responses:
         *       200:
         *         description: Producto actualizado correctamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Product updated successfully"
         *                 data:
         *                   type: object
         *                   example:
         *                     id: 1
         *                     name: "Camiseta Deportiva"
         *                     description: "Camiseta de poliéster para deportes"
         *                     price: 29.99
         *                     stock: 100
         *                     isActive: true
         *                     createdAt: "2024-09-01T10:00:00Z"
         *                     updatedAt: "2024-09-05T12:00:00Z"
         *                     image: ["imagen1.jpg", "imagen2.jpg"]
         *       400:
         *         description: Datos inválidos o error en la solicitud
         *       404:
         *         description: Producto no encontrado
         *       500:
         *         description: Error interno del servidor
         */
        router.put('/update/:id', upload.array('image', 10), controller.updateProduct);

        /**
         * @swagger
         * /api/v1/isactive/delete/{id}:
         *   delete:
         *     summary: Desactiva un producto existente
         *     description: Desactiva un producto cambiando el campo `isActive` a `false`. No elimina físicamente el producto de la base de datos.
         *     tags:
         *       - Product
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: ID del producto a desactivar
         *         schema:
         *           type: integer
         *           example: 1
         *     responses:
         *       204:
         *         description: Producto desactivado correctamente
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Producto desactivado correctamente"
         *                 data:
         *                   type: object
         *                   example: true
         *       404:
         *         description: Producto no encontrado
         *       500:
         *         description: Error interno del servidor
         */

        router.delete('/isactive/:id', controller.isActiveProduct);

        return router;
    }
}