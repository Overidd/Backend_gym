
//? router.get('/all', controller.getAll)
/**
 * @swagger
 * /api/v1/membership/all:
 *   get:
 *     summary: Listar todas las membresias
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: Listar todas las membresias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listado de todas las membresias exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Membership'
 *       500:
 *         description: Error interno del servidor
 */

//? router.post('/create', controller.create)
/**
 * @swagger
 * /api/v1/membership/create:
 *   post:
 *     summary: Crear una nueva membresía
 *     tags: [Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object     
 *             properties:
 *               duration_in_months:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string 
 *                 example: "Membresía Básica"
 *               description:
 *                 type: string
 *                 example: "Acceso completo a todas las instalaciones"
 *               price:
 *                 type: integer
 *                 example: 1500
 *               discount:
 *                 type: integer
 *                 example: 10
 *               price_total:
 *                 type: integer
 *                 example: 1350
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Membresía creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Datos de solicitud inválidos"]
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


//? router.put('/update/:id', controller.update)
/**
 * @swagger
 * /api/v1/membership/update/{id}:
 *   put:
 *     summary: Actualizar una membresía
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la membresía a actualizar
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
 *               duration_in_months:
 *                 type: integer
 *                 example: 6
 *               name:
 *                 type: string 
 *                 example: "Membresía Avanzada"
 *               description:
 *                 type: string
 *                 example: "Acceso ilimitado y descuentos en clases grupales"
 *               price:
 *                 type: integer
 *                 example: 2500
 *               discount:
 *                 type: integer
 *                 example: 15
 *               price_total:
 *                 type: integer
 *                 example: 2125
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Membresía actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Membresía actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Datos de solicitud inválidos"]
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Membership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "23123"
 *         duration_in_months:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: "Membresía de 3 meses"
 *         description:
 *           type: string
 *           example: "Membresía de 3 meses"
 *         price:
 *           type: integer
 *           example: 1500
 *         discount:
 *           type: integer
 *           example: 10
 *         price_total:
 *           type: integer
 *           example: 1350
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
