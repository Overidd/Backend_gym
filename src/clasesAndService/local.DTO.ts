import z from 'zod';
import { createClassServiceSchema, updateclassServiceSchema } from '.'
import { BadRequestException } from '../utils';

//* -----------LOCAL INTERFACES--------------
type ICreateClassServiceSchema = z.infer<typeof createClassServiceSchema>
type IUpdateclassServiceSchema = z.infer<typeof updateclassServiceSchema>

export interface IServices {
   id: number;
   name: string;
   created_at: string,
   updated_at: string
}

export interface IClases {
   id: number;
   name: string;
   created_at: string,
   updated_at: string
}

//*--------------DTO----------------

export class ClassServiceDTO {
   constructor(
      public readonly name?: string,
      public readonly description?: string,
      public readonly address?: string,
      public readonly phone?: string,
      public readonly opening_start?: string,
      public readonly opening_end?: string,
      public readonly isActivate?: boolean,
      public readonly images?: string[],
      public readonly class_id?: number[],
      public readonly services_id?: number[],
   ) { }

   static create(props: ICreateClassServiceSchema, images?: string[]) {
      try {
         // const parsedProps = localInput(props);

         // const validatedProps = createClassServiceSchema.parse(parsedProps);

         const validatedImages = images?.length ? images : undefined;

         // const { name } = validatedProps;

         // return new ClassServiceDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }

   static update(props: IUpdateclassServiceSchema, images?: string[]) {
      try {
         // const parsedProps = localInput(props);

         // const validatedProps = updateLocalSchema.parse(parsedProps);

         // const validatedImages = images?.length ? images : undefined;

         // const {
         //    name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id
         // } = validatedProps

         // return new ClassServiceDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }

         throw Error('Error inesperado');
      }
   }
}