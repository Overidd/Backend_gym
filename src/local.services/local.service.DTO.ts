import z from 'zod';
import { createlocalServiceSchema, updatelocalServiceSchema } from '.'
import { BadRequestException } from '../utils';

//* -----------LOCAL INTERFACES--------------
type ICreateLocalServiceSchema = z.infer<typeof createlocalServiceSchema>
type IUpdateLocalServiceSchema = z.infer<typeof updatelocalServiceSchema>

export interface IServices {
   id: number;
   name: string;
   icon: string;
   created_at: string,
   updated_at: string
}

export interface IClases {
   id: number;
   name: string;
   icon: string;
   created_at: string,
   updated_at: string
}

//*--------------DTO----------------
export class ClassServiceDTO {
   constructor(
      public readonly name?: string,
      public readonly icon?: string
   ) { }

   static create(props: ICreateLocalServiceSchema, icon?: string): ClassServiceDTO {
      try {
         const validatedProps = createlocalServiceSchema.parse(props);

         const iconImage = icon?.length ? icon : undefined;

         const { name } = validatedProps;

         return new ClassServiceDTO(name, iconImage)

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }

   static update(props: IUpdateLocalServiceSchema, icon?: string): ClassServiceDTO {
      try {
         const validatedProps = updatelocalServiceSchema.parse(props);

         const validatedIcon = icon?.length ? icon : undefined;

         const { name } = validatedProps

         return new ClassServiceDTO(name, validatedIcon)

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }
}