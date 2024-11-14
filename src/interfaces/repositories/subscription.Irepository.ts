import { DTOcreatePlan, DTOcreateSubscription, DTOupdatePlan, DTOupdateSubscription, IResGenaral, IResPlan, IResSubscription, IUpdateSubscription } from "../../presentation/subscription"

export interface IRespositorySubscription {
   cratePlan(data: DTOcreatePlan): Promise<IResPlan>;
   updatePlan(id: number | string, data: DTOupdatePlan): Promise<IResPlan>;
   createSubscription(date: DTOcreateSubscription): Promise<IResGenaral>
   getById(id: string | number): Promise<IResSubscription | null>;
   getByIdPlan(id: string): Promise<IResPlan | null>;
   update(id: string | number, data: DTOupdateSubscription | IUpdateSubscription): Promise<IResGenaral>
   successfulSubscription(id: string): Promise<any>
   cancelSubscription(id: string): Promise<any>
}
