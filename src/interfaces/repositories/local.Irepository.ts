import { ILocalAll, ILocalById, ILocalGeneric, CreateLocalDTO, UpdateLocalDTO, ILocalImages, ILocalDelete, ILocalLocation } from '../../presentation/local'

export interface ILocalRepository {
   getAll(services: string[], classes: string[], search: string[], page: number, pagesize: number): Promise<ILocalAll>;
   getById(id: number): Promise<ILocalById>;
   create(data: CreateLocalDTO): Promise<ILocalGeneric>;
   update(id: number, data: UpdateLocalDTO): Promise<ILocalGeneric>;
   updateImageDefault(id: number, image_id_default: number): Promise<ILocalImages>;
   deleteImage(id: number, image_id: number): Promise<ILocalImages>;
   deleteService(id: number, service_id: number): Promise<boolean>;
   deleteClases(id: number, class_id: number): Promise<boolean>;
   isActivate(id: number): Promise<boolean>;
   delete(id: number): Promise<ILocalDelete>;
   validateService(id: number): Promise<boolean>; 
   validateClass(id: number): Promise<boolean>;
   getAllLocation(): Promise<ILocalLocation[]>;
}


