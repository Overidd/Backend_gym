
//* ----------------LOCALES-------------------------
//? router.get('/all', localServiceController.getAll);
/**
* @swagger
* /api/v1/service/all:
*   get:
*     summary: Obtener todos los Servicios que ofrece cada local
*     description: Obtener todos los Servicios que ofrece cada local
*     tags: [Service]
*     responses:
*       200:
*          description: Listar todo los Servicios que ofrece cada local
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    example: "Listado de Servicios exitosamente"
*                  data:
*                    type: array
*                    items:
*                      $ref: '#/components/schemas/ServiceResponse'
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

//? router.post('/create', upload.single('icon'), localServiceController.create);
/**
* @swagger
* /api/v1/service/create:
*   post:
*     summary: Crear un nuevo servicio
*     description: Endpoint para crear un nuevo servicio en el sistema.
*     tags: [Service]
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre del servicio
*                 example: wifi
*               icon:
*                 type: string
*                 format: binary
*                 description: Icono del servicio (archivo de imagen) (opcional)
*     responses:
*       201:
*         description: Servicio creado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Servicio creado exitosamente
*                 data:
*                   $ref: '#/components/schemas/ServiceResponse'
*       400:
*         description: Error de validación de la solicitud
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messages:
*                   type: string
*                   example: ["Datos de solicitud inválidos"]
*       401:
*         description: No autorizado
*         content:
*           application/json:
*              schema:
*                type: object
*                properties:
*                   message:
*                     example: No autorizado
*       500:
*         description: Error interno del servidor
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error interno del servidor
*/

//? router.put('/update/:id', upload.single('icon'),localServiceController.update);
/**
* @swagger
* /api/v1/service/update/{id}:
*   put:
*     summary: Actualizar un servicio existente
*     description: Actualiza los detalles de un servicio existente utilizando su ID.
*     tags: [Service]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*           example: 1
*         description: ID del servicio a actualizar
*     requestBody:
*       required: false
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre del servicio (opcional)
*                 example: wifi
*               icon:
*                 type: string
*                 format: binary
*                 description: Icono del servicio (archivo de imagen) (opcional)
*     responses:
*       200:
*         description: Servicio actualizado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                  message:
*                    example: Servicio actualizado exitosamente
*                  data:
*                    $ref: '#/components/schemas/ServiceResponse'
*       400:
*         description: Error de validación de la solicitud
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messages:
*                   example: ["Datos de solicitud inválidos"]
*       404:
*         description: Servicio no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "Datos de solicitud inválidos"
*       401:
*         description: No autorizado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "No autorizado"
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

//? router.delete('/delete/:id', localServiceController.delete);
/**
* @swagger
* /api/v1/service/delete/{id}:
*   delete:
*     summary: Eliminar un servicio existente
*     description: Elimina un servicio existente utilizando su ID. La propiedad is_delete_definitive, si es verdadero, el servicio se elimina definitivamente. Si es falso, se determina si existe locales que depende del service id.
*     tags: [Service]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: ID del servicio a eliminar
*         schema:
*           type: integer
*           example: 1
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               is_delete_definitive:
*                 type: boolean
*                 example: false
*                 description: "Si es verdadero, el servicio se elimina definitivamente. Si es falso, se determina si existe locales que depende de la service id."
*     responses:
*       200:
*         description: Servicio eliminado exitosamente
*         content:
*           application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    example: Servicio eliminado exitosamente
*                  data:
*                    type: boolean
*                    exmaple: true
*       400:
*         description: Error de validación de la solicitud
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messages:
*                   example: ["Datos de solicitud inválidos"]
*       404:
*         description: Servicio no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "Datos de solicitud inválidos"
*       401:
*         description: No autorizado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "No autorizado"
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

//* ----------------SERVICES---------------------
//? router.get('/all', localServiceController.getAll);
/**
* @swagger
* /api/v1/clase/all:
*   get:
*     summary: Obtener todos los clases que ofrece cada local
*     description: Obtener todos los clases que ofrece cada local
*     tags: [Clase]
*     responses:
*       200:
*          description: Listar todo los clases que ofrece cada local
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    example: "Listado de clases exitosamente"
*                  data:
*                    type: array
*                    items:
*                      $ref: '#/components/schemas/ClasesResponse'
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

//? router.post('/create', upload.single('icon'), localServiceController.create);
/**
* @swagger
* /api/v1/clase/create:
*   post:
*     summary: Crear un nuevo clase
*     description: Endpoint para crear un nuevo clase en el sistema.
*     tags: [Clase]
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre del clase
*                 example: yoga
*               icon:
*                 type: string
*                 format: binary
*                 description: Icono del clase (archivo de imagen) (opcional)
*     responses:
*       201:
*         description: clase creado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Clase creado exitosamente
*                 data:
*                   $ref: '#/components/schemas/ClasesResponse'
*       400:
*         description: Error de validación de la solicitud
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messages:
*                   example: ["Datos de solicitud inválidos"]
*       401:
*         description: No autorizado
*         content:
*           application/json:
*              schema:
*                type: object
*                properties:
*                   message:
*                     example: No autorizado
*       500:
*         description: Error interno del servidor
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error interno del servidor
*/

//? router.put('/update/:id', upload.single('icon'),localServiceController.update);
/**
* @swagger
* /api/v1/clase/update/{id}:
*   put:
*     summary: Actualizar un clase existente
*     description: Actualiza los detalles de un Clase existente utilizando su ID.
*     tags: [Clase]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*           example: 1
*         description: ID del clase a actualizar
*     requestBody:
*       required: false
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Nombre del clase (opcional)
*                 example: wifi
*               icon:
*                 type: string
*                 format: binary
*                 description: Icono del clase (archivo de imagen) (opcional)
*     responses:
*       200:
*         description: Clase actualizado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                  message:
*                    example: Clase actualizado exitosamente
*                  data:
*                    $ref: '#/components/schemas/ClasesResponse'
*       400:
*         description: Error de validación de la solicitud
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messages:
*                   example: ["Datos de solicitud inválidos"]
*       404:
*         description: Clase no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "Datos de solicitud inválidos"
*       401:
*         description: No autorizado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "No autorizado"
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

//? router.delete('/delete/:id', localServiceController.delete);
/**
* @swagger
* /api/v1/clase/delete/{id}:
*   delete:
*     summary: Eliminar un clase existente
*     description: Elimina un clase existente utilizando su ID. La propiedad is_delete_definitive, si es verdadero, la clase se elimina definitivamente. Si es falso, se determina si existe locales que depende del clase id.
*     tags: [Clase]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: ID del clase a eliminar
*         schema:
*           type: integer
*           example: 1
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               is_delete_definitive:
*                 type: boolean
*                 example: false
*                 description: "Si es verdadero, la clase se elimina definitivamente. Si es falso, se determina si existe locales que depende de la clase id." 
*     responses:
*       200:
*         description: clase eliminado exitosamente
*         content:
*           application/json:
*              schema:
*                type: object
*                properties:
*                  message:
*                    example: Clase eliminado exitosamente
*                  data: 
*                    type: boolean
*                    exmaple: true
*       400:
*         description: ["Error de validación de la solicitud"]
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: Datos de solicitud inválidos
*       404:
*         description: clase no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "Datos de solicitud inválidos"
*       401:
*         description: No autorizado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   example: "No autorizado"
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

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: wifi
 *         icon:
 *           type: string
 *           example: https://res.cloudinary.com/...
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClasesResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: yoga
 *         icon:
 *           type: string
 *           example: https://res.cloudinary.com/...
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 */