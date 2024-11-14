import { CustomJwtPayload, IPayloadSubscription, IPaylodPlan, IPaylodService, IPaylodServiceUpdate, IResCheckSubscripton } from "../services";
import { IPayloadSendEmail } from "../services/email";

export interface HandleImage {
   uploadImage(file: Express.Multer.File, folder: string): Promise<string>;
   uploadImages(files: Express.Multer.File[], folder: string): Promise<string[]>
   publicId(url: string): string | null;
   deleteImage(url: string): Promise<boolean>;
}

export interface HandlePaypal {
   getAccessToken(): Promise<string>;
   createPlan(access_token: string, data: IPaylodPlan): Promise<string | null>;
   createSubscription(access_token: string, data: IPayloadSubscription): Promise<string | null>;
   checkSubscription(accessToken: string, subscriptionId: string): Promise<IResCheckSubscripton | null>; 
   createService(access_token: string, data: IPaylodService): Promise<string>
   updateService(access_token: string, serviceId: string, data: IPaylodServiceUpdate): Promise<boolean>
}

export interface HandleJwt {
   getToken(payload: object, expire: string): string;
   verifyToken(token: string): CustomJwtPayload | null;
   decodeToken(token: string): CustomJwtPayload | null;
}

export interface HandlePassword {
   hashPassword(password: string, salt: number): Promise<string>;
   comparePassword(password: string, passwordDatabase: string): Promise<boolean>;
}

export interface HandleQrCode {
   generateQrCode(codeLength: number): Promise<{qrCode: any, code: string}>;
}

export interface HandleSendEmaiL {
   sendEmailmembers(payload: IPayloadSendEmail): Promise<any | null>
}