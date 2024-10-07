import z from 'zod';
import { createLocalSchema, updateLocalSchema } from '.'
import { BadRequestException } from '../utils';

//* -----------LOCAL INTERFACES--------------
type ICreateLocalSchema = z.infer<typeof createLocalSchema>
type IUpdateLocalSchema = z.infer<typeof updateLocalSchema>

export interface IlocalById {
   id: number;
   name: string;
   description: string;
   address: string;
   phone: string;
   opening_start: string;
   opening_end: string;
   isActivate: boolean;
   created_at: Date,
   updated_at: Date,

   class_id: {
      id: number,
      name: string
   }[];

   services_id: {
      id: number,
      name: string
   }[];

   images: {
      id: number,
      image: string,
      default: boolean,
   }[],
}

export interface IlocalAll {
   total_item: number;
   page: number,
   page_size: number,
   locals: {
      id: number;
      name: string;
      description: string;
      address: string;
      phone: string;
      opening_start: string;
      opening_end: string;
      isActivate: boolean;
      created_at: Date,
      updated_at: Date,
      image: string,
   }[]
}
export interface IlocalGeneric {
   id: number;
   name: string;
   description: string;
   address: string;
   phone: string;
   opening_start: string;
   opening_end: string;
   isActivate: boolean;
   created_at: Date,
   updated_at: Date,
   image: string,
}
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
const localInput = (props: any) => {
   if (typeof props?.opening_start === 'string') {
      props.opening_start = new Date(props.opening_start)
   };
   if (typeof props?.opening_end === 'string') {
      props.opening_end = new Date(props.opening_end)
   };
   if (typeof props?.isActivate === 'string') {
      props.isActivate = JSON.parse(props.isActivate)
   };
   if (typeof props?.class_id === 'string') {
      props.class_id = JSON.parse(props.class_id)
   };
   if (typeof props?.services_id === 'string') {
      props.services_id = JSON.parse(props.services_id)
   };
   return props;
}

export class LocalDTO {
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

   static create(props: ICreateLocalSchema, images?: string[]): LocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = createLocalSchema.parse(parsedProps);

         const validatedImages = images?.length ? images : undefined;

         const { name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id } = validatedProps;

         return new LocalDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }

   static update(props: IUpdateLocalSchema, images?: string[]): LocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = updateLocalSchema.parse(parsedProps);

         const validatedImages = images?.length ? images : undefined;

         const {
            name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id
         } = validatedProps

         return new LocalDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }

         throw Error('Error inesperado');
      }
   }
}