import { IResGenaral } from "../../presentation/membership";
import { DTOMembership } from "../../presentation/membership/DTO";

export interface IRepositoryMembership {
   getAll(): Promise<IResGenaral[]>;
   create(data: DTOMembership): Promise<IResGenaral>;
   update(id: string, data: DTOMembership): Promise<IResGenaral>;
}