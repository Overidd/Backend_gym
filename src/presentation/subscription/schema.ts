import z from 'zod'


export const SchemaPlan = z.object({
   membership_id: z.string({
      required_error: 'El ID de la membresía es requerido',
   }),

   email: z.string({
      invalid_type_error: 'El correo electrónico debe ser una dirección de correo electrónico',
   }).email({
      message: 'El correo electrónico debe ser una dirección de correo electrónico',
   }).optional(),

   first_name: z.string({
      invalid_type_error: 'El Nombre debe ser una cadena',
   }).max(150, {
      message: 'El Nombre debe tener como maximo 150 caracteres',
   }).optional(),

   last_name: z.string({
      invalid_type_error: 'El apellido debe ser una cadena',
   }).optional(),
})

export const createplanSchema = SchemaPlan.omit({})

export const SchemaSubscription = z.object({
   membership_end: z.date({
      invalid_type_error: 'La fecha debe ser una fecha',
   }).optional(),
   membership_start: z.date({
      invalid_type_error: 'La fecha debe ser una fecha',
   }).optional(),
   is_active: z.boolean({
      invalid_type_error: 'El estado debe ser un valor booleano',
   }).optional(),
   access_code: z.string({
      invalid_type_error: 'El codigo de acceso debe ser una cadena',
   }).optional(),
   plan_id: z.string({
      invalid_type_error: 'El ID de la membresía se un cadena',
   }).optional(),
   subscription_id: z.string({
      invalid_type_error: 'El ID de la membresía se un cadena',
   }).optional(),
   membership_id: z.string({
      invalid_type_error: 'El ID de la membresía se un cadena',
   }).optional(),
   user_id: z.number({
      invalid_type_error: 'El ID debe ser un número',
   }).int().optional(),
   status: z.string({
      invalid_type_error: 'El estado debe ser una cadena',
   }).optional(),
})
export const updatesubscriptionSchema = SchemaSubscription.partial()