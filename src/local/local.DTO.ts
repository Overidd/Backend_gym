import z from 'zod';
import { createLocalSchema, updateLocalSchema } from '.'
import { BadRequestException, ErrorDate } from '../utils';

//* -----------LOCAL INTERFACES--------------
type ICreateLocalSchema = z.infer<typeof createLocalSchema>
type IUpdateLocalSchema = z.infer<typeof updateLocalSchema>

type Ilocal = Omit<IUpdateLocalSchema, 'opening_start' | 'opening_end'>
interface IlocalComplete extends Ilocal {
   opening_start?: Date; // Cambiado a Date
   opening_end?: Date;   // Cambiado a Date
}

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
   items: number,
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

const validateDate = (props: any, isCreate = false): IlocalComplete => {
   const date = new Date();
   const month = date.getMonth();
   const day = date.getDate();
   const year = date.getFullYear();
   const dateNow = `${month + 1}-${day}-${year}`

   if (typeof props?.opening_start === 'string') {
      const dateComplete = dateNow + '-' + props.opening_start
      props.opening_start = new Date(dateComplete)

      if (isNaN(props.opening_start.getTime())) {
         throw Error("Error al momento de procesar la fecha.");
      }
   };
   if (typeof props?.opening_end === 'string') {
      const dateComplete = dateNow + '-' + props.opening_end
      props.opening_end = new Date(dateComplete)

      if (isNaN(props.opening_start.getTime())) {
         throw Error("Error al momento de procesar la fecha.");
      }
   };

   if (isCreate) {
      if (props.opening_start > props.opening_end) {
         throw new BadRequestException("La fecha de apertura no puede ser mayor a la fecha de cierre.");
      }
   }
   return props
}

//*--------------DTO----------------
export class LocalDTO {
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

   static create(props: ICreateLocalSchema, images?: string[]): LocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = createLocalSchema.parse(parsedProps);

         const validatedImages = images?.length ? images : undefined;

         const validateData = validateDate(validatedProps, true);

         const { name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id } = validateData;

         return new LocalDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         if (error instanceof ErrorDate) {

         }
         throw Error('Error inesperado');
      }
   }

   static update(props: IUpdateLocalSchema, images?: string[]): LocalDTO {
      try {
         const parsedProps = localInput(props);

         const validatedProps = updateLocalSchema.parse(parsedProps);

         const validatedImages = images?.length ? images : undefined;

         const validateData = validateDate(validatedProps, false);

         const { name, description, address, phone, opening_start, opening_end, isActivate, class_id, services_id } = validateData;

         return new LocalDTO(name, description, address, phone, opening_start, opening_end, isActivate, validatedImages, class_id, services_id);

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }
}