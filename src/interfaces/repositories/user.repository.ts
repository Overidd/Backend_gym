import { DTOCreateUser, DTOUpdateUser, IResUser } from "../../presentation/user"


export interface IRepositoryUser {
   validateUser(id: number): Promise<boolean>
   create(data: DTOCreateUser): Promise<IResUser>
   update(id: number, data: DTOUpdateUser): Promise<IResUser>
}
