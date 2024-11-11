import z from 'zod'

import { createplanSchema, updatesubscriptionSchema } from "./schema";
import { ICreatePlan, ICreateSubscription, IUpdateSubscription, StatusEnum } from "./types";
import { BadRequestException } from '../../utils';

export class DTOcreatePlan {
   constructor(
      public readonly membership_id: string,
      public user_id?: number,
   ) { }

   static create(props: ICreatePlan): DTOcreatePlan {
      try {
         const validateData = createplanSchema.parse(props)

         return new DTOcreatePlan(validateData.membership_id)

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw new Error();
      }
   }
}

export class DTOcreateSubscription {
   constructor(
      public readonly membership_start: Date,
      public readonly membership_end: Date,
      public readonly plan_id: string,
      public readonly user_id: number,
      public readonly membership_id: string,
      public readonly status: StatusEnum,
   ) { }

   static create(props: ICreateSubscription): DTOcreateSubscription {
      try {
         return new DTOcreateSubscription(
            props.membership_start,
            props.membership_end,
            props.plan_id,
            props.user_id,
            props.membership_id,
            props.status,
         )
      } catch (error) {
         throw new Error();
      }
   }
}

export class DTOupdateSubscription {
   constructor(
      public readonly membership_start: Date | undefined,
      public readonly membership_end: Date | undefined,
      public readonly is_active: boolean | undefined,
      public readonly access_code: string | undefined,
      public readonly plan_id: string | undefined,
      public readonly subscription_id: string | undefined,
      public readonly membership_id: string | undefined,
      public readonly user_id: number | undefined,
      public readonly status: StatusEnum | undefined,
   ) { }

   static update(props: IUpdateSubscription): DTOupdateSubscription {
      try {
         const data = updatesubscriptionSchema.parse(props)
         return new DTOupdateSubscription(
            data.membership_start,
            data.membership_end,
            data.is_active,
            data.access_code,
            data.plan_id,
            data.subscription_id,
            data.membership_id,
            data.user_id,
            data.status as StatusEnum,
         )
      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw new Error();
      }
   }
}