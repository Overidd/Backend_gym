import { ITrainer, TrainerDTO } from "../../trainer";

export interface ITrainerRepository {
   getAll(): Promise<ITrainer[]>;
   create(trainer: TrainerDTO): Promise<ITrainer>;
   getById(id?: number, email?: string): Promise<ITrainer | null>;
    update(id: number, trainer: TrainerDTO): Promise<{
      updatedTrainer: ITrainer;
      trainerPast: ITrainer | null;
   }> ;
   delete(id: number): Promise<ITrainer>;
}