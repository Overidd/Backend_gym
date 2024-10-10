import { IServices, LocalServiceDTO } from "../../local.services";

export interface IlocalServiceRepository {
   getAll(): Promise<IServices[]>;
   create(data: LocalServiceDTO): Promise<IServices>;
   update(id: number, data: LocalServiceDTO): Promise<IServices>;
}