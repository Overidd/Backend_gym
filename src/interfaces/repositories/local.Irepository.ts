import { IlocalAll, IlocalById, IlocalGeneric, CreateLocalDTO, UpdateLocalDTO, IlocalImages } from '../../local'

export interface ILocalRepository {
   getAll(services: string[], classes: string[], search: string, page: number, pagesize: number): Promise<IlocalAll>;
   getById(id: number): Promise<IlocalById>;
   create(data: CreateLocalDTO): Promise<IlocalGeneric>;
   update(id: number, data: UpdateLocalDTO): Promise<IlocalGeneric>;
   updateImageDefault(id: number, image_id_default: number): Promise<boolean>;
   deleteService(id: number, service_id: number): Promise<boolean>;
   deleteClases(id: number, class_id: number): Promise<boolean>;
   deleteImage(id: number, image_id: number): Promise<IlocalImages>;
   isActivate(id: number): Promise<boolean>;
   delete(id: number): Promise<boolean>;
}


