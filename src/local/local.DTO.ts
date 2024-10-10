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
   opening_start: Date;
   opening_end: Date;
   isActivate: boolean;
   created_at: Date,
   updated_at: Date,

   clases: {
      id: number,
      name: string
   }[];

   services: {
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
   items: number,
   page: number,
   page_total: number,
   locals: {
      id: number;
      name: string;
      description: string;
      address: string;
      phone: string;
      opening_start: Date;
      opening_end: Date;
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
   opening_start: Date;
   opening_end: Date;
   isActivate: boolean;
   created_at: Date,
   updated_at: Date,
   clases?:{
      count: number,
   };

   services?: {
      count: number,
   };

   images?: {
      count: number,
   },
}

export interface IlocalImages {
   id: number;
   image: string;
   default: boolean,
   local_id: number
}

//*--------------Validations----------------
const localInput = (props: any) => {
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

const validateDate = (opening_start?: string | Date, opening_end?: string | Date, isCreate = false) => {
   const date = new Date();
   const month = date.getMonth();
   const day = date.getDate();
   const year = date.getFullYear();
   const dateNow = `${month + 1}-${day}-${year}`

   if (typeof opening_start === 'string') {
      const dateComplete = dateNow + '-' + opening_start
      opening_start = new Date(dateComplete)

      if (isNaN(opening_start.getTime())) {
         throw Error("Error al momento de procesar la fecha.");
      }
   };
   if (typeof opening_end === 'string') {
      const dateComplete = dateNow + '-' + opening_end
      opening_end = new Date(dateComplete)

      if (isNaN(opening_start!.getTime())) {
         throw Error("Error al momento de procesar la fecha.");
      }
   };

   if (isCreate) {
      if (opening_start! > opening_end!) {
         throw new BadRequestException("La fecha de apertura no puede ser mayor a la fecha de cierre.");
      }
   }
   return {
      date_start: opening_start,
      date_end: opening_end
   }
}

//*--------------DTO----------------
export class CreateLocalDTO {
   constructor(
      public readonly name: string,
      public readonly description: string,
      public readonly address: string,
      public readonly phone: string,
      public readonly opening_start: Date,
      public readonly opening_end: Date,
      public readonly isActivate: boolean,
      public readonly images: string[] | undefined,
      public readonly class_id: number[],
      public readonly services_id: number[],
   ) { }

   static create(props: ICreateLocalSchema, images?: string[]): CreateLocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = createLocalSchema.parse(parsedProps);
         const validatedImages = images?.length ? images : undefined;

         const { name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id } = validatedProps;

         // Validar fechas
         const { date_start, date_end } = validateDate(opening_start, opening_end, true);

         return new CreateLocalDTO(name, description, address, phone, date_start!, date_end!, isActivate, validatedImages, class_id, services_id);
      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }
}

export class UpdateLocalDTO {
   constructor(
      public readonly name?: string,
      public readonly description?: string,
      public readonly address?: string,
      public readonly phone?: string,
      public readonly opening_start?: Date,
      public readonly opening_end?: Date,
      public readonly isActivate?: boolean,
      public readonly images?: string[],
      public readonly class_id?: number[],
      public readonly services_id?: number[],
   ) { }

   static update(props: IUpdateLocalSchema, images?: string[]): UpdateLocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = updateLocalSchema.parse(parsedProps);
         const validatedImages = images?.length ? images : undefined;

         const { name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id } = validatedProps;

         // Validar fechas
         const { date_start, date_end } = validateDate(opening_start, opening_end, false);

         return new UpdateLocalDTO(name, description, address, phone, date_start, date_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }
}