import { IResGenaral } from "../../presentation/membership";
import { DTOMembership } from "../../presentation/membership/DTO";

export interface IRepositoryMembership {
   getAll(): Promise<IResGenaral[]>;
   create(data: DTOMembership, serviceId: string): Promise<IResGenaral>;
   update(id: string, data: DTOMembership, serviceId?: string): Promise<IResGenaral>;
   validateMembership(id: string): Promise<IResGenaral | null>;
}