import { z } from 'zod'
import { createLocalSchema, updateLocalSchema } from "./schema";

export type ICreateLocalSchema = z.infer<typeof createLocalSchema>
export type IUpdateLocalSchema = z.infer<typeof updateLocalSchema>

export type ILocalById = {
   id: number;
   name: string;
   description: string | undefined | null;
   phone: string;
   opening_start: Date | string;
   opening_end: Date | string;
   isActivate: boolean;
   created_at: Date,
   updated_at: Date,

   location: {
      address: string,
      city: string,
      country: string,
      zip_code: string,
      latitude: number,
      longitude: number,
   },

   clases: {
      id: number,
      name: string,
      icon: string | null,
   }[];

   services: {
      id: number,
      name: string,
      icon: string | null,
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
      description: string | undefined | null;
      phone: string;
      opening_start: Date | string;
      opening_end: Date | string;
      isActivate: boolean;
      image: string,
      location: {
         address: string,
         city: string,
         country: string,
      }
      created_at: Date,
      updated_at: Date,
   }[]
}

export type ILocalGeneric = {
   id: number;
   name: string;
   description: string | undefined | null;
   phone: string;
   opening_start: Date | string;
   opening_end: Date | string;
   isActivate: boolean;
   location?: {
      address: string,
      city: string,
      country: string,
      zip_code: string,
      latitude: number,
      longitude: number,
   },
   clases?: {
      count: number,
   };

   services?: {
      count: number,
   };

   images?: {
      count: number,
   },
   created_at: Date,
   updated_at: Date,
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
   description: string | undefined | null;
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
   service: string[] | string,
   clase: string[] | string,
   search: string,
   page: string,
   pagesize: string
}

export type ILocalLocation = {
   id: number,
   address: string,
   city: string,
   country: string,
   zip_code: string,
   latitude: number,
   longitude: number,
}