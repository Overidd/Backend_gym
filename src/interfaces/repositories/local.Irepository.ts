import {IlocalById, IlocalGeneric} from '../../local'

export interface ILocalRepository {
   createLocal(data: LocalDTO): Promise<IlocalGeneric>;
   getLocals(): Promise<any>;
   getLocal(id: string): Promise<any>;
   updateLocal(id: string, data: any): Promise<any>;
   deleteLocal(id: string): Promise<any>;
}