import { BadRequestException } from "./Errors";

export const validateId = (id: string): number => {
   const parsedId = parseInt(id);
   if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException(['El ID proporcionado no es válido']);
   }
   return parsedId
}

export const validateArray = (value: string | string[]) => {
   return (typeof value === 'string' ? value ? Array(value) : [] : value);
}