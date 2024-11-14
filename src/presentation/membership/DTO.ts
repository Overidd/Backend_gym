import z from 'zod';

import { BadRequestException } from '../../utils';
import { ICreateMembership, IUpdateMembership } from "./types";
import { createMembershipSchema, updateMembershipSchema } from "./schema";

export class DTOMembership {
   constructor(
      public readonly duration_in_months?: number,
      public readonly name?: string,
      public readonly price?: number,
      public readonly description?: string | undefined,
      public readonly discount?: number | undefined,
      public readonly status?: boolean | undefined,
   ) { }

   static create(props: ICreateMembership): DTOMembership {
      try {
         const validateDate = createMembershipSchema.parse(props)

         return new DTOMembership(
            validateDate.duration_in_months!,
            validateDate.name!,
            validateDate.price!,
            validateDate.description,
            validateDate.discount,
            validateDate.status,
         )
      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado del servidor');
      }
   }

   static update(props: IUpdateMembership) {
      try {
         const validateDate = updateMembershipSchema.parse(props)

         return new DTOMembership(
            validateDate.duration_in_months,
            validateDate.name,
            validateDate.price,
            validateDate.description,
            validateDate.discount,
            validateDate.status,
         )
      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw Error('Error inesperado del servidor');
      }
   }
}
