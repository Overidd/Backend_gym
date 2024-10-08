import { z } from 'zod';

export const trainerSchema = z.object({
   first_name: z.string({
      required_error: '[first_name] es requerido',
      invalid_type_error: '[first_name] debe ser una cadena',
   }).max(255),
   last_name: z.string({
      required_error: '[last_name] es requerido',
      invalid_type_error: '[last_name] debe ser una cadena',
   }).max(255),

   email : z.string({
      required_error: '[email] es requerido',
      invalid_type_error: '[email] debe ser una dirección de correo electrónico',
   }).email({
      message: '[email] Debe ser una dirección de correo electrónico'
   }),
   phone: z.string({
      required_error: '[phone] es requerido',
      invalid_type_error: '[phone] debe ser un número',
   }).min(6,{
      message: '[phone] debe tener como minimo 6 dígitos',
   }).max(10, {
      message: '[phone] debe tener como maximo 10 dígitos',
   }),
   specialization: z.string({
      required_error: '[specialization] es requerido',
      invalid_type_error: '[specialization] debe ser una cadena',
   }).min(5, {
      message: '[specialization] debe tener como minimo 5 caracteres',
   }).max(255, {
      message: '[specialization] debe tener como maximo 255 caracteres',
   }),
   description: z.string({
      invalid_type_error: '[description] debe ser una cadena',
   }).max(500).optional(),
   isActive: z.boolean({
      invalid_type_error: '[isActive] debe ser booleano',
   }).default(true),
})

export const createTrainerSchema = trainerSchema.pick({
   first_name: true,
   last_name: true,
   email: true,
   phone: true,
   specialization: true,
   description: true,
   isActive: true,
})

export const updateTrainerSchema = trainerSchema.partial()