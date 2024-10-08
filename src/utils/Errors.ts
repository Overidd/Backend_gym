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
   constructor(message: string) {
      super(message);
      this.name = 'BadRequestException';
      this.statusCode = 400;
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
   constructor(message:string) {
       super(message);
       this.name = "ErrorDate";
   }
}