import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres";
import { IRepositoryUser } from "../../interfaces";
import { DTOCreateUser, DTOUpdateUser } from "./DTO";
import { IResUser } from "./types";
import { NotFoundException } from "../../utils";

export class RepositoryUser implements IRepositoryUser {
   async create(data: DTOCreateUser): Promise<IResUser> {
      try {
         const newUser = await prisma.user.create({
            data: {
               email: data.email,
               password: data.password,
               first_name: data.first_name,
               last_name: data.last_name,
               is_active: data.is_active,
               is_confirmed: data.is_confirmed,
               is_google_account: data.is_google_account,
               imagen: data.imagen,
               is_user_temp: data.is_user_temp,
            },
            select: {
               id: true,
               email: true,
               first_name: true,
               last_name: true,
               is_active: true,
               is_confirmed: true,
               is_google_account: true,
               is_user_temp: true,
               imagen: true,
               created_at: true,
               updated_at: true,
            }
         })
         return newUser
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
               throw new NotFoundException(`El usuario ya existe`);
            };
         };
         throw new Error();
      }
   }
   async update(id: number, data: DTOUpdateUser): Promise<IResUser> {
      try {
         const user = await prisma.user.update({
            where: {
               id: id
            },
            data: {
               email: data.email,
               password: data.password,
               first_name: data.first_name,
               last_name: data.last_name,
               is_active: data.is_active,
               is_confirmed: data.is_confirmed,
               is_google_account: data.is_google_account,
               is_user_temp: data.is_user_temp,
            }
         })

         return user
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException(`El usuario  no existe`);
            };
         };
         throw new Error();
      }
   }
   async validateUser(id?: number, email?: string): Promise<IResUser | null> {
      try {
         const filter: { id?: number; email?: string } = {};
         if (id) filter.id = id;
         if (email) filter.email = email;

         const user = await prisma.user.findFirst({ where: filter });
         return user || null;
      } catch (error) {
         return null;
      }
   }

   async createTemp(data: DTOCreateUser): Promise<IResUser> {
      try {
         const newUser = await prisma.user.create({
            data: {
               email: data.email,
               password: data.password,
               first_name: data.first_name,
               last_name: data.last_name,
               is_active: data.is_active,
               is_confirmed: data.is_confirmed,
               is_google_account: data.is_google_account,
               imagen: data.imagen,
               is_user_temp: data.is_user_temp,
            },
         })
         return newUser
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
               throw new NotFoundException(`El usuario ya existe`);
            };
         };
         throw new Error();
      }
   }
}