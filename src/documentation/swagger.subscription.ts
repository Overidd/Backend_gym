
//* router.post('/create/plan', controller.createPlan)
/**
 * @swagger
 * /api/v1/subscription/create/plan:
 *   post:
 *     summary: Crear plan de membresia
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membership_id:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Suscripcion creado exitosamente. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Suscripcion creada exitosamente
 *                 data:
 *                   type: object
 *                   example: {}
 */

//* router.post('/success/:suscripcionId', controller.successfulSubscription)
/**
 * @swagger
 * /api/v1/subscription/success/{suscripcionId}:
 *   post:
 *     summary: Suscripcion exitosa
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: suscripcionId
 *         required: true
 *         description: ID de la suscripcion
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@gamil.com"
 *                 required: true
 *               fist_name:
 *                 type: string
 *                 example: "John"
 *                 required: true
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: Suscripcion exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 message:   
 *                   type: string
 *                   example: Suscripcion exitosa
 *       400:
 *         description: Dastos inválidos
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
 *       404:
 *         description: Suscripcion no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Suscripcion no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: ["Error inesperado"]
 */

//* router.get('/cancel/plan/:planId', controller.cancelSubscription)
/**
 * @swagger
 * /api/v1/subscription/cancel/plan/{planId}:
 *   get:
 *     summary: Cancelar plan
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         description: ID del plan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan cancelada exitosamente"
 *       404:
 *         description: Plan no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plan no encontrada"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: ["Error inesperado"]
 */
