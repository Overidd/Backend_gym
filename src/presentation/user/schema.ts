import z from 'zod';

const UserSchema = z.object({
   first_name: z.string({
      required_error: 'El Nombre es requerido',
      invalid_type_error: 'El Nombre debe ser una cadena',
   }).max(255),
   last_name: z.string({
      required_error: 'EL apellido es requerido',
      invalid_type_error: 'EL apellido debe ser una cadena',
   }).max(255),

   email: z.string({
      required_error: 'Email es requerido',
      invalid_type_error: 'Email debe ser una dirección de correo electrónico',
   }).email({
      message: 'Email debe ser una dirección de correo electrónico'
   }),

   password: z.string({
      required_error: 'La contraseña es requerida',
      invalid_type_error: 'La contraseña debe ser una cadena',
   }).min(8, {
      message: 'La contraseña debe tener como minimo 8 caracteres',
   }).max(255, {
      message: 'La contraseña debe tener como maximo 255 caracteres',
   }),
   
   is_active: z.boolean({
      invalid_type_error: 'El estado de activación debe ser verdadero o falso.',
   }).default(true).optional(),
})

export const createUserSchema = UserSchema.omit({})
export const updateUserSchema = UserSchema.partial()