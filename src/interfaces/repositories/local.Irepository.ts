import { IlocalAll, IlocalById, IlocalGeneric, LocalDTO } from '../../local'

export interface ILocalRepository {
   getAll(services: string[], classes: string[], search: string, page: number, page_size: number): Promise<IlocalAll>;

   getById(id: string): Promise<IlocalById>;

   createLocal(data: LocalDTO): Promise<IlocalGeneric>;

   update(id: string, data: LocalDTO): Promise<IlocalGeneric>;

   delete(id: string): Promise<boolean>;
}


