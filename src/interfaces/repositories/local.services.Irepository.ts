import { IServices, LocalServiceDTO } from "../../local.services";

export interface ILocalServiceRepository {
   getAll(): Promise<IServices[]>;
   create(data: LocalServiceDTO): Promise<IServices>;
   update(id: number, data: LocalServiceDTO): Promise<{ update: IServices, dataPast: IServices }> 
   delete(id: number, is_delete_definitive: boolean): Promise<IServices>;
}