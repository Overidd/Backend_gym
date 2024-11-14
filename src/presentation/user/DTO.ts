import z from 'zod';
import { BadRequestException, generatePassword } from '../../utils';
import { createUserSchema, updateUserSchema } from "./schema";
import { ICreateUser, IUpdateUser } from "./types";

export class DTOCreateUser {
   constructor(
      public readonly first_name: string,
      public readonly last_name: string,
      public readonly email: string,
      public password: string,
      public readonly is_confirmed?: boolean,
      public readonly is_google_account?: boolean,
      public readonly is_active?: boolean,
      public readonly imagen?: string,
      public readonly is_user_temp?: boolean,
   ) { }

   static create(props: ICreateUser, imagen?: string, isGeneratePassword = false) {
      try {

         if (isGeneratePassword) {
            props.password = generatePassword(12);
         }

         const validateData = createUserSchema.parse({
            first_name: props.first_name,
            last_name: props.last_name,
            password: props.password,
            email: props.email,
         })

         const validateImage = imagen ? imagen : undefined

         if (
            (props.is_confirmed && typeof props.is_confirmed !== 'boolean') ||
            (props.is_google_account && typeof props.is_google_account !== 'boolean') ||
            (props.is_active && typeof props.is_active !== 'boolean')
         ) {
            throw new Error();
         }

         return new DTOCreateUser(
            validateData.first_name,
            validateData.last_name,
            validateData.email,
            validateData.password,
            props.is_confirmed,
            props.is_google_account,
            validateData.is_active,
            validateImage,
            props.is_user_temp,
         )
      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw new Error();
      }
   }
}

export class DTOUpdateUser {
   constructor(
      public readonly first_name?: string,
      public readonly last_name?: string,
      public readonly email?: string,
      public readonly password?: string,
      public readonly is_confirmed?: boolean,
      public readonly is_google_account?: boolean,
      public readonly is_active?: boolean,
      public readonly imagen?: string,
      public readonly is_user_temp?: boolean,
   ) { }

   static update(props: IUpdateUser): DTOUpdateUser {
      try {
         const validateData = updateUserSchema.parse(props)

         return new DTOUpdateUser(
            validateData.first_name,
            validateData.last_name,
            validateData.email,
            validateData.password,
            props.is_confirmed,
            props.is_google_account,
            validateData.is_active,
            props.imagen,
            props.is_user_temp,
         )

      } catch (error) {
         if (error instanceof z.ZodError) {
            throw new BadRequestException(error.errors.map(e => e.message).join(', '))
         }
         throw new Error();
      }
   }
}