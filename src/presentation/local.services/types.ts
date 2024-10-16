import { z } from "zod";
import { createlocalServiceSchema, updatelocalServiceSchema } from "./schema";

export type ICreateLocalServiceSchema = z.infer<typeof createlocalServiceSchema>
export type IUpdateLocalServiceSchema = z.infer<typeof updatelocalServiceSchema>

export type IServices = {
   id: number;
   name: string;
   icon: string;
   created_at: Date,
   updated_at: Date
}