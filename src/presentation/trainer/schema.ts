import { z } from 'zod';

export const trainerSchema = z.object({
   first_name: z.string({
      required_error: 'El Nombre es requerido',
      invalid_type_error: 'El Nombre debe ser una cadena',
   }).max(255),
   last_name: z.string({
      required_error: 'EL apellido es requerido',
      invalid_type_error: 'EL apellido debe ser una cadena',
   }).max(255),

   email : z.string({
      required_error: 'Email es requerido',
      invalid_type_error: 'Email debe ser una dirección de correo electrónico',
   }).email({
      message: 'Email debe ser una dirección de correo electrónico'
   }),
   phone: z.string({
      required_error: 'El teléfono es requerido',
      invalid_type_error: 'El teléfono debe ser un número',
   }).min(6,{
      message: 'El teléfono debe tener como minimo 6 dígitos',
   }).max(10, {
      message: 'El teléfono debe tener como maximo 10 dígitos',
   }),
   specialization: z.string({
      required_error: 'La especialización es requerido',
      invalid_type_error: 'La especialización debe ser una cadena',
   }).min(5, {
      message: 'La especialización debe tener como minimo 5 caracteres',
   }).max(255, {
      message: 'La especialización debe tener como maximo 255 caracteres',
   }),
   description: z.string({
      invalid_type_error: 'La description debe ser una cadena',
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