import { DTOCreateUser, DTOUpdateUser, IResUser, IResUserTemp } from "../../presentation/user"


export interface IRepositoryUser {
   validateUser(id?: number, email?: string): Promise<IResUser | null>;
   create(data: DTOCreateUser): Promise<IResUser>
   createTemp(data: DTOCreateUser): Promise<IResUserTemp>
   update(id: number, data: DTOUpdateUser): Promise<IResUser>
}
