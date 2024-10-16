import { Router } from 'express'
import { LocalController, LocalRepository } from '.';
import multer from 'multer';

const storageFile = multer.memoryStorage();
const upload = multer({ storage: storageFile });

export class LocalRouter {
   public get router(): Router {
      const router = Router();
      const localRepository = new LocalRepository()
      const controller = new LocalController(localRepository);

      router.get('/all', controller.getAll);
      /**
      * @swagger
      * /api/v1/local/all:
      *   get:
      *     summary: Obtiene un listado de locales con filtros opcionales
      *     description: Retorna todos los locales activos, con la opción de filtrar por servicios, clases, búsqueda por nombre y paginación.
      *     tags: [Local]
      *     parameters:
      *       - in: query
      *         name: services
      *         schema:
      *           type: array
      *           items:
      *             type: string
      *           example: ["aire", "calefaccion"]
      *         description: Filtrar locales por los servicios que ofrecen.
      *       - in: query
      *         name: clases
      *         schema:
      *           type: array
      *           items:
      *             type: string
      *           example: ["clase1", "clase2"]
      *         description: Filtrar locales por las clases disponibles.
      *       - in: query
      *         name: search
      *         schema:
      *           type: string
      *           example: "local"
      *         description: Buscar locales por nombre, servicios o clases.
      *       - in: query
      *         name: page
      *         schema:
      *           type: integer
      *           default: 1
      *           example: 1
      *         description: Número de página solicitada para la paginación. Por defecto es 1.
      *       - in: query
      *         name: pagesize
      *         schema:
      *           type: integer
      *           default: 10
      *           example: 10
      *         description: Cantidad de locales por página. Por defecto es 10.
      *     responses:
      *       200:
      *         description: Listado de locales obtenidos exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Listado de locales obtenido exitosamente"
      *                 data:
      *                   example:
      *                     items: 10
      *                     page: 1
      *                     page_total: 6
      *                     locals:
      *                       - id: 1
      *                         name: "Gimnasio XYZ"
      *                         description: "Un gimnasio con las mejores instalaciones"
      *                         address: "Calle Principal #123"
      *                         phone: "+1-555-555-5555"
      *                         opening_start: "10:00:00"
      *                         opening_end: "18:00:00"
      *                         isActivate: true
      *                         image: "https://example.com/image.png"
      *                         created_at: "2024-08-01T12:00:00Z"
      *                         updated_at: "2024-08-01T12:00:00Z"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error interno del servidor"
      */

      router.get('/get/:id', controller.getById);
      /**
      * @swagger
      * /api/v1/local/get/{id}:
      *   get:
      *     summary: Obtiene un local por su ID
      *     description: Retorna la información detallada de un local específico, incluyendo clases, servicios e imágenes.
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: integer
      *         description: ID del local a obtener
      *     responses:
      *       200:
      *         description: Local obtenido exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local listado exitosamente"
      *                 data:
      *                   type: object
      *                   example:
      *                     id: 1
      *                     name: "Local ABC"
      *                     description: "Gimnasio de alto rendimiento"
      *                     address: "Calle Principal #123"
      *                     phone: "+1-555-555-5555"
      *                     opening_start: "10:00:00"
      *                     opening_end: "18:00:00"
      *                     isActivate: true
      *                     created_at: "2024-08-01T12:00:00Z"
      *                     updated_at: "2024-08-01T12:00:00Z"
      *                     clases:
      *                       - id: 1
      *                         name: "Yoga"
      *                       - id: 2
      *                         name: "Pilates"
      *                     services:
      *                       - id: 1
      *                         name: "Aire Acondicionado"
      *                       - id: 2
      *                         name: "WiFi"
      *                     images:
      *                       - id: 1
      *                         image: "https://example.com/image1.png"
      *                         default: true
      *                       - id: 2
      *                         image: "https://example.com/image2.png"
      *                         default: false
      *       404:
      *         description: Local no encontrado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local no encontrado"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error interno del servidor"
      */

      router.post('/create', upload.array('images'), controller.create);
      /**
      * @swagger
      * /api/v1/local/create:
      *   post:
      *     summary: Crea un nuevo local
      *     description: Crea un nuevo local con información detallada, incluyendo clases, servicios e imágenes.
      *     tags: [Local]
      *     requestBody:
      *       required: true
      *       content:
      *         multipart/form-data:
      *           schema:
      *             type: object
      *             properties:
      *               name:
      *                 type: string
      *                 description: Nombre del local
      *                 example: "Local ABC"
      *               description:
      *                 type: string
      *                 description: Descripción del local
      *                 example: "Gimnasio de alto rendimiento"
      *               address:
      *                 type: string
      *                 description: Dirección del local
      *                 example: "Calle Principal #123"
      *               phone:
      *                 type: string
      *                 description: Teléfono de contacto
      *                 example: "+1-555-555-5555"
      *               opening_start:
      *                 type: string
      *                 format: time
      *                 description: Hora de apertura
      *                 example: "10:00:00"
      *               opening_end:
      *                 type: string
      *                 format: time
      *                 description: Hora de cierre
      *                 example: "18:00:00"
      *               isActivate:
      *                 type: boolean
      *                 description: Estado de activación del local
      *                 example: true
      *               services_id:
      *                 type: array
      *                 items:
      *                   type: integer
      *                 description: IDs de los servicios asociados
      *                 example: [1, 2]
      *               class_id:
      *                 type: array
      *                 items:
      *                   type: integer
      *                 description: IDs de las clases asociadas
      *                 example: [1, 2]
      *               images:
      *                 type: array
      *                 items:
      *                   type: string
      *                   format: binary
      *                 description: Imágenes del local 
      *     responses:
      *       201:
      *         description: Nuevo local creado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Nuevo local creado exitosamente"
      *                 data:
      *                   type: object
      *                   example:
      *                     id: 1
      *                     name: "Local ABC"
      *                     description: "Gimnasio de alto rendimiento"
      *                     address: "Calle Principal #123"
      *                     phone: "+1-555-555-5555"
      *                     opening_start: "10:00:00"
      *                     opening_end: "18:00:00"
      *                     isActivate: true
      *                     created_at: "2024-08-01T12:00:00Z"
      *                     updated_at: "2024-08-01T12:00:00Z"
      *                     clases:
      *                       count: 2
      *                     services:
      *                       count: 2
      *                     images:
      *                       count: 1
      *       400:
      *         description: Solicitud incorrecta (error en la validación de los datos)
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error en los datos enviados"
      *       401:
      *         description: Acceso no autorizado
      *         content:
      *           aplication/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                    example: "Acceso no autorizado"
      *       404:
      *         description: Local no encontrado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local no encontrado"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error interno del servidor"
      */

      router.put('/update/:id', upload.array('images'), controller.update);
      /**
      * @swagger
      * /api/v1/local/update/{id}:
      *   put:
      *     summary: Actualiza un local existente, crea nuevas imagenes, clases y servicios.
      *     description: Actualiza la información de un local por ID. Todos los campos son opcionales.
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: integer
      *         description: ID del local a actualizar
      *     requestBody:
      *       required: true
      *       content:
      *         multipart/form-data:
      *           schema:
      *             type: object
      *             properties:
      *               name:
      *                 type: string
      *                 description: Nombre del local (opcional)
      *                 example: "Local ABC"
      *               description:
      *                 type: string
      *                 description: Descripción del local (opcional)
      *                 example: "Gimnasio renovado"
      *               address:
      *                 type: string
      *                 description: Dirección del local (opcional)
      *                 example: "Calle Principal #123"
      *               phone:
      *                 type: string
      *                 description: Teléfono de contacto (opcional)
      *                 example: "+1-555-555-5555"
      *               opening_start:
      *                 type: string
      *                 format: time
      *                 description: Hora de apertura (opcional)
      *                 example: "09:00:00"
      *               opening_end:
      *                 type: string
      *                 format: time
      *                 description: Hora de cierre (opcional)
      *                 example: "20:00:00"
      *               isActivate:
      *                 type: boolean
      *                 description: Estado de activación del local (opcional)
      *                 example: true
      *               services_id:
      *                 type: array
      *                 items:
      *                   type: integer
      *                 description: IDs de los servicios asociados (opcional)
      *                 example: [1, 2]
      *               class_id:
      *                 type: array
      *                 items:
      *                   type: integer
      *                 description: IDs de las clases asociadas (opcional)
      *                 example: [1, 2]
      *               images:
      *                 type: array
      *                 items:
      *                   type: string
      *                   format: binary
      *                 description: Imágenes del local (opcional)
      *     responses:
      *       200:
      *         description: Local actualizado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local actualizado exitosamente"
      *                 data:
      *                   type: object
      *                   example:
      *                     id: 1
      *                     name: "Local ABC"
      *                     description: "Gimnasio renovado"
      *                     address: "Calle Principal #123"
      *                     phone: "+1-555-555-5555"
      *                     opening_start: "09:00:00"
      *                     opening_end: "20:00:00"
      *                     isActivate: true
      *                     created_at: "2024-08-01T12:00:00Z"
      *                     updated_at: "2024-08-01T12:30:00Z"
      *                     clases:
      *                       count: 2
      *                     services:
      *                       count: 2
      *                     images:
      *                       count: 1
      *       400:
      *         description: Solicitud incorrecta (error en la validación de los datos)
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error en los datos enviados"
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *              schema:
      *                 type: object
      *                 properties:
      *                    message:
      *                      example: "No autorizado"
      *       404:
      *         description: Local no encontrado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local no encontrado"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Error interno del servidor"
      */

      router.put('/image/default/:id', controller.updateImageDefault);
      /**
      * @swagger
      * /api/v1/local/image/default/{id}:
      *   put:
      *     summary: "Establecer una imagen como la predeterminada de un local"
      *     description: Actualiza una imagen específica para que sea la predeterminada de un local. 
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         required: true
      *         schema:
      *           type: integer
      *           example: 1
      *         description: ID del local al que pertenece la imagen
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               image_id_default:
      *                 type: integer
      *                 description: ID de la imagen que se establecerá como predeterminada
      *                 example: 1
      *     responses:
      *       200:
      *         description: Imagen predeterminada actualizada exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Imagen predeterminada actualizada exitosamente"
      *                 data:
      *                   type: object
      *                   properties:
      *                     id:
      *                       type: integer
      *                       description: ID de la imagen
      *                       example: 1
      *                     image:
      *                       type: string
      *                       description: URL de la imagen
      *                       example: "https://example.com/image.png"
      *                     isDefault:
      *                       type: boolean
      *                       description: Indica si la imagen es predeterminada
      *                       example: true
      *                     local_id:
      *                       type: integer
      *                       description: ID del local asociado a la imagen
      *                       example: 1
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "No autorizado"
      *       404:
      *         description: Local o imagen no encontrados
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Local o imagen no encontrados"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Error interno del servidor"
      */


      router.put('/activate/:id', controller.isActivate);
      /**
      * @swagger
      * /api/v1/local/activate/{id}:
      *   put:
      *     summary: "Actualizar el estado de un local"
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         schema:
      *           type: integer
      *           example: 1
      *         required: true
      *         description: ID del local
      *     responses:
      *       200:
      *         description: Local actualizado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local actualizado exitosamente"
      *                 data:
      *                   example: true
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "No autorizado"
      *       404:
      *         description: Local no encontrado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Local no encontrado"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Error interno del servidor"
      */

      router.delete('/delete/:id', controller.delete);
      /**
      * @swagger
      * /api/v1/local/delete/{id}:
      *   delete:
      *     summary: Eliminar un local
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         schema:
      *           type: integer
      *           example: 1
      *         required: true
      *         description: ID del local
      *     responses:
      *       200:
      *         description: Local eliminado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Local eliminado exitosamente"
      *                 data:
      *                   example: true
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "No autorizado"
      *       404:
      *         description: Local no encontrado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Local no encontrado"
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Error interno del servidor"
      */

      router.delete('/delete/image/:id', controller.deleteImage);
      /**
       * @swagger
       * /api/v1/local/delete/image/{id}:
       *   delete:
       *     summary: Eliminar una imagen de un local
       *     tags: [Local]
       *     parameters:
       *       - in: path
       *         name: id
       *         schema:
       *           type: integer
       *           example: 1
       *         required: true
       *         description: ID de la imagen
       *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               image_id:
      *                 type: integer
      *                 description: ID de una imagen que se este relacionado con el local
      *                 example: 1 
       *     responses:
       *       200:
       *         description: Imagen eliminada exitosamente
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   example: "Imagen eliminada exitosamente"
       *                 data:
       *                   example:
       *                     id: 1
       *                     image: "https://example.com/image.png"
       *                     isDefault: true
       *                     local_id: 1
       *       400:
       *         description: Solicitud incorrecta (error en la validación de los datos)
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   example: "Datos invalidas" 
       *       401:
       *         description: No autorizado
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   example: "No autorizado"
       *       404:
       *         description: Imagen no encontrada
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   example: "Imagen no encontrada"
       *       500:
       *         description: Error interno del servidor
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message:
       *                   example: "Error interno del servidor"
       */

      router.delete('/delete/service/:id', controller.deleteService);
      /**
      * @swagger
      *  /api/v1/local/delete/service/{id}:
      *   delete:
      *     summary: Eliminar un servicio de un local
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         schema:
      *           type: integer
      *           example: 1
      *         required: true
      *         description: ID del servicio
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               service_id:
      *                 type: integer
      *                 description: ID de un servicio que se este relacionado con el local
      *                 example: 1
      *     responses:
      *       200:
      *         description: Servicio eliminado exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Servicio eliminado exitosamente"
      *                 data:
      *                   example: true
      *       400:
      *         description: Solicitud incorrecta (error en la validación de los datos)
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Datos invalidas" 
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "No autorizado" 
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Error interno del servidor"
      */

      router.delete('/delete/class/:id', controller.deleteClases);
      /**
      * @swagger
      *  /api/v1/local/delete/class/{id}:
      *   delete:
      *     summary: Eliminar una clase de un local
      *     tags: [Local]
      *     parameters:
      *       - in: path
      *         name: id
      *         schema:
      *           type: integer
      *           example: 1
      *         required: true
      *         description: ID de la clase
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               class_id:
      *                 type: integer
      *                 description: ID de una clase que se este relacionado con el local
      *                 example: 1 
      *     responses:
      *       200:
      *         description: Clase eliminada exitosamente
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Clase eliminada exitosamente"
      *                 data:
      *                   example: true
      *       400:
      *         description: Solicitud incorrecta (error en la validación de los datos)
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   example: "Datos invalidas"
      *       401:
      *         description: No autorizado
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "No autorizado" 
      *       500:
      *         description: Error interno del servidor
      *         content:
      *           application/json:
      *             schema:
      *               type: object
      *               properties:
      *                 message:
      *                   type: string
      *                   example: "Error interno del servidor"
      */

      return router;
   };
}