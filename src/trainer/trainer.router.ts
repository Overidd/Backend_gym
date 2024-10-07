import { Router } from 'express';
import multer from 'multer';
import { TrainerController, TrainerRepository } from '.';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export class TrainerRouter {

   public get router(): Router {

      const router = Router();
      const repository = new TrainerRepository()
      const controller = new TrainerController(repository);


      /**
      * @swagger
      * /api/v1/trainer/all:
      *   get:
      *     summary: Get all trainers
      *     tags: [Trainer]
      *     responses:
      *       200:
      *         description: Listar trainers
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "get all trainers"
      *                 data:
      *                   type: array
      *                   items:
      *                     $ref: '#/components/schemas/Trainer'
      *       500:
      *         description: Error interno del servidor   
      */

      router.get('/all', controller.getAllTrainers)

      /**
      * @swagger
      * /api/v1/trainer/create:
      *   post:
      *     summary: Crea un nuevo trainer
      *     description: Crea un nuevo trainer en la base de datos.
      *     tags: [Trainer]
      *     requestBody:
      *       required: true
      *       content:
      *         multipart/form-data:
      *           schema:
      *             type: object
      *             properties:
      *               first_name:
      *                 type: string
      *                 example: "john"
      *                 description: Nombre del trainer
      *               last_name:
      *                 type: string
      *                 example: "apellido"
      *                 description: Apellido del trainer
      *               email:
      *                 type: string
      *                 example: "example@gmail.com"
      *                 description: Email del trainer
      *               phone:
      *                 type: number
      *                 example: 123456789
      *                 description: Telefono del trainer
      *               specialization:
      *                 type: string
      *                 example: ""
      *                 description: Especialización del trainer 
      *               image:
      *                 type: string
      *                 format: binary
      *                 description: Imágen del trainer
      *               description:
      *                 type: string
      *                 example: ""
      *                 description: Descripción del trainer (opcional)
      *               isActive:
      *                 type: boolean
      *                 example: true
      *                 description: Indica si el trainer está activo (opcional)
      *     responses:
      *       201:
      *         description: Trainer creado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Product created successfully"
      *                 data:
      *                   type: array
      *                   items:
      *                    $ref: '#/components/schemas/Trainer'
      *       400:
      *         description: Datos inválidos
      *       401:
      *         description: No autorizado
      *       500:
      *         description: Error interno del servidor
      */
      router.post('/create', upload.single('image'), controller.createTrainer)

      /**
   * @swagger
   * /api/v1/trainer/update/{id}:
   *   put:
   *     summary: Actualizar un trainer
   *     description: Actualizar datos del trainer específico basado en su ID. Todos los campos son opcionales, incluida la imagen.
   *     tags: [Trainer]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID del trainer a actualizar
   *         schema:
   *           type: integer
   *           example: 1
   *     requestBody:
   *       required: false
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               first_name:
   *                 type: string
   *                 example: ""
   *                 description: Nombre del trainer (opcional)
   *               last_name:
   *                 type: string
   *                 example: ""
   *                 description: Apellido del trainer (opcional)
   *               email:
   *                 type: string
   *                 example: ""
   *                 description: Email del trainer (opcional)
   *               phone:
   *                 type: string
   *                 example: ""
   *                 description: Teléfono del trainer (opcional)
   *               specialization:
   *                 type: string
   *                 example: ""
   *                 description: Especialización del trainer (opcional)
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Imágen del trainer (opcional)
   *               description:
   *                 type: string
   *                 example: ""
   *                 description: Descripción del trainer (opcional)
   *               isActive:
   *                 type: boolean
   *                 example: true
   *                 description: Indica si el trainer está activo (opcional)
   *     responses:
   *       200:
   *         description: Trainer actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Trainer updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Trainer'
   *       404:
   *         description: Trainer no encontrado
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
      router.put('/update/:id', upload.single('image'), controller.updateTrainer)

      /**
       * @swagger
       * /api/v1/trainer/delete/{id}:
       *   delete:
       *     summary: Eliminar un trainer
       *     description: Eliminar un trainer de la base de datos
       *     tags: [Trainer]
       *     parameters:
       *       - name: id
       *         in: path
       *         required: true
       *         description: ID de un trainer a eliminar
       *         schema:
       *           type: integer
       *           example: 1
       *     responses:
       *       204:
       *         description: Eliminar un trainer
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   type: string
       *                   example: "Trainer eliminado correctamente"
       *                 data:
       *                   type: object
       *                   example: true
       *       401:
       *         description: No autorizado
       *       404:
       *         description: Tra inerno encontrado
       *       500:
       *         description: Error interno del servidor
       */
      router.delete('/delete/:id', controller.deleteTrainer)

      return router
   }
}
/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         firstname:
 *           type: string
 *           example: "Nombre"
 *         lastname:
 *           type: string
 *           example: "Apellidos"
 *         email:
 *           type: string
 *           example: "example@gmail.com"
 *         phone:
 *           type: string
 *           example: "123456789"
 *         specialization:
 *           type: string
 *           example: "trainer"
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/..."
 *         description:
 *           type: string
 *           example: "trainer"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         updatedAt:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 */
