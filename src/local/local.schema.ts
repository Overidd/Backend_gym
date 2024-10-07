import z from 'zod';

export const localSchema = z.object({
   name: z.string({
      required_error: '[name] es requerido',
      invalid_type_error: '[name] debe ser una cadena',
   }).max(100,{
      message: '[name] debe tener como maximo 100 caracteres',
   }),
   description: z.string({
      required_error: '[description] es requerido',
      invalid_type_error: '[description] debe ser una cadena',
   }).max(500, {
      message: '[description] debe tener como maximo 500 caracteres',
   }),
   address: z.string({
      required_error: '[address] es requerido',
      invalid_type_error: '[address] debe ser una cadena',
   }).max(100),
   phone: z.string({
      required_error: '[phone] es requerido',
      invalid_type_error: '[phone] debe ser una cadena',
   }).regex(/^\d+$/, "El teléfono debe contener solo números").min(6,{
      message: '[phone] debe tener como minimo 6 dígitos',
   }).max(10, {
      message: '[phone] debe tener como maximo 10 dígitos',
   }),
   opening_start: z.string({
      required_error: '[opening_start] es requerido',
      invalid_type_error: '[opening_start] debe ser una cadena',
   }).time({
      message: '[opening_start] debe ser una hora',
   }),
   opening_end: z.string({
      required_error: '[opening_end] es requerido',
      invalid_type_error: '[opening_end] debe ser una cadena',
   }).time({
      message: '[opening_end] debe ser una hora',
   }),
   isActivate: z.boolean({
      required_error: '[isActivate] es requerido',
      invalid_type_error: '[isActivate] debe ser un booleano',
   }).default(true),

   class_id: z.array(z.number({
      required_error: '[class_id] es requerido un id de una clase',
      invalid_type_error: '[class_id] debe ser un arreglo array de id de clases',
   }).int({
      message: '[class_id] debe ser un arreglo array de id de clases',
   })),
   services_id: z.array(z.number({
      required_error: '[services_id] es requerido un id de un servicios',
      invalid_type_error: '[services_id] debe ser un arreglo array de id de servicios',
   }).int({
      message: '[services_id] debe ser un matriz array de id de servicios',
   })),
})

export const createLocalSchema = localSchema.omit({})
export const updateLocalSchema = localSchema.partial()