import { prisma } from "../data/postgres";
import { ITrainerRepository } from "../interfaces/repositories";
import { BadRequestException, DeactivatedException, NotFoundException } from "../utils";
import { ITrainer, TrainerDTO } from "./trainer.DTOS";

export class TrainerRepository implements ITrainerRepository {
   async getAll(): Promise<ITrainer[]> {
      const trainers = await prisma.trainer.findMany({
         where: { isActive: true },
      });

      return trainers
   }

   async getById(id?: number, email?: string): Promise<ITrainer | null> {

      const data = {
         email: email,
         id: id
      };

      const trainer = await prisma.trainer.findUnique({
         where: { ...data },
      });

      if (!trainer) throw new NotFoundException('Entrenador no encontrado');

      if (trainer.isActive === false) throw new DeactivatedException('Entrenador desactivado');

      return trainer
   }

   async create(trainer: TrainerDTO): Promise<ITrainer> {

      try {
         const newTrainer = await prisma.trainer.create({
            data: {
               first_name: trainer.first_name!,
               last_name: trainer.last_name!,
               email: trainer.email!,
               phone: trainer.phone!,
               specialization: trainer.specialization!,
               description: trainer.description!,
               isActive: trainer.isActive,
               image: trainer.image!
            }
         })

         return newTrainer

      } catch (error) {
         console.log(error);
         throw new BadRequestException('Entrenador ya existente');
      }

   }
   async update(id: number, trainer: TrainerDTO): Promise<{
      updatedTrainer: ITrainer;
      trainerPast: ITrainer | null;
   }> {

      const trainerDB = await this.getById(id, trainer.email);

      const updatedTrainer = await prisma.trainer.update({
         where: { id },
         data: {
            first_name: trainer.first_name,
            last_name: trainer.last_name,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            description: trainer.description,
            isActive: trainer.isActive,
            image: trainer.image
         }
      })

      return {
         updatedTrainer: updatedTrainer,
         trainerPast: trainerDB,
      }
   }

   async delete(id: number): Promise<ITrainer> {

      try {
         const deleteTrainer =  await prisma.trainer.delete({
            where: { id },
         })
         
         return deleteTrainer
      } catch (error) {
         
         throw new NotFoundException('Entrenador no encontrado');
      }
   }
} 