import z from 'zod'

import { createplanSchema, updateplanSchema, updatesubscriptionSchema } from './schema'
import { $Enums } from '@prisma/client';

export type ICreatePlan = z.infer<typeof createplanSchema>
export type IUpdatePlan = z.infer<typeof updateplanSchema>
export type IUpdateSubscription = z.infer<typeof updatesubscriptionSchema>


export enum StatusEnum {
  PENDING = "PENDING",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
  VENCIDO = "VENCIDO",
  ACTIVO = "ACTIVO"
}

export type ICreateSubscription = {
  membership_start: Date,
  membership_end: Date,
  access_code: string,
  subscription_id: string,
  status: StatusEnum,
  plan_id: number,
  user_id: number | undefined,
}

export type IResGenaral = {
  id: number;
  membership_end: Date;
  membership_start: Date;
  is_active: boolean;
  access_code: string | null;
  subscription_id: string | null;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  plans_id: number;
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

export type IResPlan = {
  id: number,
  plan_id: string,
  email?: string | null,
  status: $Enums.statusEnum,
  membership_id: string,
  created_at: Date,
  updated_at: Date,

  membership?: {
    duration_in_months: number,
  }
}