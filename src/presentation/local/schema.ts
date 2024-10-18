import z from 'zod';

export const localSchema = z.object({
   name: z.string({
      required_error: 'El nombre es requerido.',
      invalid_type_error: 'El nombre debe ser un texto válido.',
   }).max(100, {
      message: 'El nombre no debe tener más de 100 caracteres.',
   }),
   description: z.string({
      required_error: 'La descripción es requerida.',
      invalid_type_error: 'La descripción debe ser un texto válido.',
   }).max(500, {
      message: 'La descripción no debe tener más de 500 caracteres.',
   }),
   address: z.string({
      required_error: 'La dirección es requerida.',
      invalid_type_error: 'La dirección debe ser un texto válido.',
   }).max(100, {
      message: 'La dirección no debe tener más de 100 caracteres.',
   }),
   phone: z.string({
      required_error: 'El número de teléfono es requerido.',
      invalid_type_error: 'El número de teléfono debe ser un texto válido.',
   }).regex(/^\d+$/, 'El número de teléfono solo debe contener números.')
      .min(6, {
         message: 'El número de teléfono debe tener al menos 6 dígitos.',
      }).max(10, {
         message: 'El número de teléfono no debe tener más de 10 dígitos.',
      }),
   opening_start: z.string({
      required_error: 'La hora de apertura es requerida.',
      invalid_type_error: 'La hora de apertura debe ser un texto válido.',
   }).regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de apertura debe estar en el formato HH:mm:ss.',
   }),
   opening_end: z.string({
      required_error: 'La hora de cierre es requerida.',
      invalid_type_error: 'La hora de cierre debe ser un texto válido.',
   }).regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'La hora de cierre debe estar en el formato HH:mm:ss.',
   }),
   isActivate: z.boolean({
      invalid_type_error: 'El estado de activación debe ser verdadero o falso.',
   }).default(true).optional(),

   class_id: z.array(z.number({
      required_error: 'Es obligatorio seleccionar al menos una clase.',
      invalid_type_error: 'El ID de la clase debe ser un número.',
   }).int({
      message: 'El ID de la clase debe ser un número entero.',
   })),

   services_id: z.array(z.number({
      required_error: 'Es obligatorio seleccionar al menos un servicio.',
      invalid_type_error: 'El ID del servicio debe ser un número.',
   }).int({
      message: 'El ID del servicio debe ser un número entero.',
   })),
});


export const createLocalSchema = localSchema.omit({})
export const updateLocalSchema = localSchema.partial()
