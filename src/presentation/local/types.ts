import { z } from 'zod'
import { createLocalSchema, updateLocalSchema } from "./schema";

export type ICreateLocalSchema = z.infer<typeof createLocalSchema>
export type IUpdateLocalSchema = z.infer<typeof updateLocalSchema>

export type ILocalById = {
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

export type ILocalAll = {
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
      image: string,
      created_at: Date,
      updated_at: Date,
   }[]
}

export type ILocalGeneric = {
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
   clases?: {
      count: number,
   };

   services?: {
      count: number,
   };

   images?: {
      count: number,
   },
}

export type ILocalImages = {
   id: number;
   image: string;
   default: boolean,
   local_id: number
}

export type ILocalDelete = {
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
   images: {
      image: string,
   }[];
}

export type queryString = {
   services: string[] | string,
   clases: string[] | string,
   search: string,
   page: string,
   pagesize: string
}
