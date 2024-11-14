
//* router.post('/create', controller.createPlan)
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
 *               email:
 *                  type: string
 *                  example: "joe@example.com"
 *               first_name:  
 *                  type: string
 *                  example: "joe"
 *               last_name:
 *                  type: string
 *                  example: "doe"
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
