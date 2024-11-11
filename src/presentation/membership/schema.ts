import z from 'zod';


const MembershipSchema = z.object({
   duration_in_months: z.number({
      required_error: 'La duración en meses es requerido',
      invalid_type_error: 'La duración en meses debe ser un número entero',
   }),

   name: z.string({
      required_error: 'El nombre es requerido',
      invalid_type_error: 'El nombre debe ser una cadena',
   }).max(100, {
      message: 'El nombre debe tener como maximo 100 caracteres',
   }),

   description: z.string({
      required_error: 'La descripción es requerida',
      invalid_type_error: 'La descripción debe ser una cadena',
   }).optional(),

   price: z.number({
      required_error: 'El precio es requerido',
      invalid_type_error: 'El precio debe ser un número decimal con hasta dos decimales',
   }).min(0,{
      message: 'El precio no puede ser negativo',
   }),
   
   discount: z.number({
      required_error: 'El descuento es requerido',
      invalid_type_error: 'El descuento debe ser un número decimal con hasta dos decimales',
   }).min(0,{
      message: 'El descuento no puede ser negativo',
   }).int().optional(),

   status: z.boolean({
      required_error: 'El estado es requerido',
      invalid_type_error: 'El estado debe ser booleano',
   }).default(true).optional()
})


export const createMembershipSchema = MembershipSchema.omit({})
export const updateMembershipSchema = MembershipSchema.partial()