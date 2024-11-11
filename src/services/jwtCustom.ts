import jwt, { JwtPayload } from "jsonwebtoken";
import { envs } from "../config";

export interface CustomJwtPayload extends JwtPayload {
   userId: number;
   email: string;
   imagen: string,
   first_name: string,
}
export class JwtCustom {
   constructor() { }

   static getToken(payload: object, expire = '1d'): string {
      return jwt.sign(payload, envs.secret_token, {
         expiresIn: expire
      })
   };

   static verifyToken(token: string): CustomJwtPayload | null {
      try {
         //Si el token es valido retorna el payload decodificado
         return jwt.verify(token, envs.secret_token) as CustomJwtPayload;
      } catch (error) {
         return null
      }
   };

   static decodeToken(token: string): CustomJwtPayload | null {
      const decode = jwt.decode(token)
      if(!decode) return null;
      return decode as CustomJwtPayload
   }
}
