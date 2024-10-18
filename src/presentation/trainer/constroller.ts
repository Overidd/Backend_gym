import type { Request, Response } from 'express';
import { TrainerDTO } from "./DTO";
import { BadRequestException, extractPublicIdFromUrl, NotFoundException, UnauthorizedException, validateId } from "../../utils";
import { cloudinary } from '../../config/cloudinary.config';
import { HandlerImage,ITrainerRepository } from '../../interfaces';

export class TrainerController {
   constructor(
      private readonly TrainerRepository: ITrainerRepository,
      private readonly handlerImage: HandlerImage,
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
            throw new BadRequestException(['Image es requerido']);
         }

         const urlUpload  = await this.handlerImage.uploadImage(image, 'trainer')

         const trainer = TrainerDTO.create(req.body, urlUpload);

         const newTrainer = await this.TrainerRepository.create(trainer!);

         res.status(201).json({
            'message': 'Trainer creado exitosamente',
            'data': newTrainer
         })

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(error.statusCode).json({
               'messages': error.messages,
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
         const idParse = validateId(req.params.id);
         const image = req.file as Express.Multer.File
         
         const trainerDTO = TrainerDTO.update(req.body);
         
         if (image) {
            const urlUpload = await this.handlerImage.uploadImage(image, 'trainer')
            trainerDTO.image = urlUpload  
         }

         const { updatedTrainer, trainerPast } = await this.TrainerRepository.update(idParse, trainerDTO!);

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
               'messages':error.messages,
            })
         }

         return res.status(500).json({
            'message': 'Error inesperado',
         })
      }
   }

   public deleteTrainer = async (req: Request, res: Response) => {
      try {
         const idParse = validateId(req.params.id);
         const deleteTrainer = await this.TrainerRepository.delete(idParse);

         if (deleteTrainer.image){
            const imageDistroy = await this.handlerImage.deleteImage(deleteTrainer.image);

            if (!imageDistroy) {
               return res.status(200).json({
                  message: 'Se elimino el trainer pero no se pudo eliminar la imagen de Cloudinary',
                  data: true,
               });
            }
         }
         
         res.status(200).json({
            'message': 'trainer deleted successfully',
            'data': true
         })
         
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         }
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