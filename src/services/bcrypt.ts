import bcrypt from 'bcrypt';

export class BcryptCustom {
   static hashPassword(password: string, salt = 10): Promise<string> {
      return bcrypt.hash(password, salt);
   }

   static comparePassword(password: string, passwordDatabase: string): Promise<boolean> {
      return bcrypt.compare(password, passwordDatabase);
   }
}
