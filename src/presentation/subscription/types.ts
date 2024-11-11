import z from 'zod'

import { createplanSchema, updatesubscriptionSchema } from './schema'
import { $Enums } from '@prisma/client';

export type ICreatePlan = z.infer<typeof createplanSchema>
export type IUpdateSubscription = z.infer<typeof updatesubscriptionSchema>

export enum StatusEnum {
  PENDING = "PENDING",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
  VENCIDO = "VENCIDO",
  ACTIVO = "ACTIVO"
}

export type ICreateSubscription = {
  membership_start: Date;
  membership_end: Date;
  plan_id: string;
  status: StatusEnum;
  user_id: number;
  membership_id: string;
}

export type IResGenaral = {
  id: number;
  membership_start: Date;
  membership_end: Date;
  is_active: boolean;
  access_code: string | null;
  plan_id: string;
  subscription_id: string | null;
  status: $Enums.statusEnum;
  user_id: number;
  membership_id: string;
  created_at: Date;
}

export type IResSubscription = {
  id: number;
  membership_start: Date;
  membership_end: Date;
  is_active: boolean;
  access_code: string | null;
  plan_id: string;
  subscription_id: string | null;
  status: $Enums.statusEnum;
  user_id: number;
  membership_id: string;
  created_at: Date;

  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_user_temp: boolean,
    password: string,
  };
}
