
import z from 'zod';
import { createTrainerSchema, updateTrainerSchema } from './schema';
import { BadRequestException } from '../../utils';

export type CreateProduct = z.infer<typeof createTrainerSchema>;
export type UpdateProduct = z.infer<typeof updateTrainerSchema>;

//* Formato de la respuesta del trainer
export interface ITrainer {
   id: number,
   first_name: string,
   last_name: string,
   email: string,
   phone: string,
   specialization: string,
   description: string | null | undefined,
   isActive: boolean,
   createdAt: Date,
   updatedAt: Date,
   image: string | undefined,
}

const parseInput = (props: any) => {
   if (typeof props?.isActive === 'string') {
      props.isActive = JSON.parse(props.isActive)
   };
   return props;
}

export class TrainerDTO {
   constructor(
      public readonly first_name?: string,
      public readonly last_name?: string,
      public readonly email?: string,
      public readonly phone?: string,
      public readonly specialization?: string,
      public readonly description?: string,
      public readonly isActive?: boolean,
      public image?: string,
   ) { }

   static create(props: CreateProduct, image?: string): TrainerDTO {
      try {
         const parsedTrainer = parseInput(props)
         const validatedTrainer = createTrainerSchema.parse(parsedTrainer);

         const { email, first_name, last_name, phone, specialization, description, isActive } = validatedTrainer;

         const validatedImage = image?.length ? image : undefined

         return new TrainerDTO(first_name, last_name, email, phone, specialization, description, isActive, validatedImage)

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }

   static update(props: UpdateProduct, image?: string): TrainerDTO {
      try {
         const parsedTrainer = parseInput(props)
         const validatedTrainer = updateTrainerSchema.parse(parsedTrainer);

         const { email, first_name, last_name, phone, specialization, description, isActive } = validatedTrainer;
         const validatedImage = image?.length ? image : undefined

         return new TrainerDTO(first_name, last_name, email, phone, specialization, description, isActive, validatedImage)

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado');
      }
   }
}