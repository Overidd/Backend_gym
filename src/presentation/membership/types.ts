import z from 'zod';

import { createMembershipSchema, updateMembershipSchema } from './schema';
export type ICreateMembership = z.infer<typeof createMembershipSchema>;
export type IUpdateMembership = z.infer<typeof updateMembershipSchema>;

export type IResGenaral = {
   id: string;
   duration_in_months: number;
   name: string;
   price: number;
   service_id: string;
   description?: string | undefined | null;
   discount?: number | undefined | null;
   price_total?: number | undefined | null;
   status?: boolean | undefined | null;
   created_at: Date;
   updated_at: Date;
}