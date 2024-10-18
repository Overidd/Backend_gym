import z from 'zod';

export const localServiceSchema = z.object({
   name: z.string({
      required_error: 'El nombre es requerido',
      invalid_type_error: 'El nombre debe ser una cadena',
   }).max(100,{
      message: 'El nombre debe tener como maximo 100 caracteres',
   }),
})

export const createlocalServiceSchema = localServiceSchema.omit({})
export const updatelocalServiceSchema = localServiceSchema.partial()
