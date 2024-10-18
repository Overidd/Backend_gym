export class NotFoundException extends Error {
   public statusCode: number;

   constructor(message: string) {
      super(message);
      this.name = 'NotFoundException';
      this.statusCode = 404;
   }
}

export class DeactivatedException extends Error {
   public statusCode: number;
   constructor(message: string) {
      super(message);
      this.name = 'DeactivatedException';
      this.statusCode = 403;
   }
}

export class BadRequestException extends Error {
   public statusCode: number;
   public messages: string[];
   constructor(message: string[] | string) {
      const errorMessage = Array.isArray(message) ? message.join(', ') : message;
      super(errorMessage);
      this.name = 'BadRequestException';
      this.statusCode = 400;
      this.messages = Array.isArray(message) ? message : message.split(', ');
   }
}

export class UnauthorizedException extends Error {
   public statusCode: number;
   constructor(message: string) {
      super(message);
      this.name = 'UnauthorizedException';
      this.statusCode = 401;
   }
}

export class ErrorDate extends Error {
   constructor(message: string) {
      super(message);
      this.name = "ErrorDate";
   }
}

export class ErrorUploadImage extends Error {
   public statusCode: number;
   constructor(message: string) {
      super(message);
      this.name = "ErrorUploadImage";
      this.statusCode = 500;
   }
}

export const requiredImagen = 'La imagen es requerida'