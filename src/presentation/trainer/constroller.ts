import type { Request, Response } from 'express';
import { ITrainerRepository } from "../../interfaces/repositories";
import { TrainerDTO } from "./DTO";
import { BadRequestException, extractPublicIdFromUrl, NotFoundException, UnauthorizedException, uploadToCloudinary } from "../../utils";
import { cloudinary } from '../../config/cloudinary';

export class TrainerController {
   constructor(
      private readonly TrainerRepository: ITrainerRepository
   ) { }

   public getAllTrainers = async (_req: Request, res: Response) => {

      try {
         const trainers = await this.TrainerRepository.getAll();

         res.status(200).json({
            'message': 'get all trainers',
            'data': trainers
         });

      } catch (error) {
         res.status(500).json({
            'message': 'Error inesperado',
         })
      }
   }

   public createTrainer = async (req: Request, res: Response) => {

      try {
         const image = req.file as Express.Multer.File

         if (!image) {
            throw new BadRequestException('Image es requerido');
         }

         const resultCloudinary  = await uploadToCloudinary(image, 'trainer')

         const trainer = TrainerDTO.create(req.body, resultCloudinary?.secure_url);

         const newTrainer = await this.TrainerRepository.create(trainer!);

         res.status(201).json({
            'message': 'trainer created successfully',
            'data': newTrainer
         })

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(error.statusCode).json({
               'message': error.message,
            })
         }

         if (error instanceof UnauthorizedException) {
            return res.status(error.statusCode).json({
               'message': error.message,
            })
         }

         return res.status(500).json({
            'message': 'Error inesperado',
         })
      }
   }

   public updateTrainer = async (req: Request, res: Response) => {
      try {
         const id = parseInt(req.params.id);
         const image = req.file as Express.Multer.File

         let resultCloudinary = undefined

         if (image) {
            resultCloudinary = await uploadToCloudinary(image, 'trainer')
         }

         const trainer = TrainerDTO.update(req.body, resultCloudinary?.secure_url);

         const { updatedTrainer, trainerPast } = await this.TrainerRepository.update(id, trainer!);

         if (trainerPast?.image && image) {
            const publicId = extractPublicIdFromUrl(trainerPast.image);
            
            const result = await cloudinary.
            uploader.destroy(publicId!);

            if (result.result !== 'ok') {
               return res.status(200).json({
                  message: 'Actualizacion exitosamente. La imagen se elimino de Cloudinary',
                  data: result,
               });
            }
         }

         res.status(200).json({
            'message': 'trainer updated successfully',
            'data': updatedTrainer
         })

      } catch (error) {

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               'message': error.message,
            })
         }

         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               'message': error.message,
            })
         }


         if (error instanceof BadRequestException) {
            return res.status(400).json({
               'message':error.message,
            })
         }

         return res.status(500).json({
            'message': 'Error inesperado',
         })
      }
   }

   public deleteTrainer = async (req: Request, res: Response) => {
      try {
         const id = parseInt(req.params.id);
         const deleteTrainer = await this.TrainerRepository.delete(id);

         if (deleteTrainer.image){
            const publicId = extractPublicIdFromUrl(deleteTrainer.image);
            
            const resul = await cloudinary.uploader.destroy(publicId!);

            if (resul.result !== 'ok') {
               return res.status(200).json({
                  message: 'Se elimino el trainer pero no se pudo eliminar la imagen de Cloudinary',
                  error: resul,
               });
            }
         }
         
         res.status(200).json({
            'message': 'trainer deleted successfully',
            'data': true
         })
         
      } catch (error) {
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               'message': error.message,
            })
         }

         if (error instanceof UnauthorizedException){
            return res.status(401).json({
               'message': error.message,
            })
         }
         res.status(500).json({
            'message': 'Error inesperado',
         })
         
      }
   }
}