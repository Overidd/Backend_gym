import { DTOcreateSubscription, DTOupdateSubscription, IResGenaral, IResSubscription, IUpdateSubscription } from "../../presentation/subscription"

export interface IRespositorySubscription {
   createSubscription(date: DTOcreateSubscription): Promise<IResGenaral>
   getById(id: string | number): Promise<IResSubscription | null>
   update(id: string | number, data: DTOupdateSubscription | IUpdateSubscription): Promise<IResGenaral>
   successfulSubscription(id: string): Promise<any>
   cancelSubscription(id: string): Promise<any>
}
