import z from 'zod'


export const SchemaPlan = z.object({
   email: z.string({
      invalid_type_error: 'El correo electrónico debe ser una dirección de correo electrónico',
   }).email({
      message: 'El correo electrónico debe ser una dirección de correo electrónico',
   }).optional(),

   plan_id: z.string({
      required_error: 'El ID de la membresía es requerido',
   }).optional(),

   status: z.string({
      required_error: 'El estado de la membresía es requerido',
   }).optional(),
   
   membership_id: z.string({
      required_error: 'El ID de la membresía es requerido',
   }),
})

export const createplanSchema = SchemaPlan.omit({})
export const updateplanSchema = SchemaPlan.partial()

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
   plan_id: z.number({
      invalid_type_error: 'El ID de la membresía se un numero',
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