import { Request, Response } from 'express';

import { BadRequestException, NotFoundException, UnauthorizedException } from "../../utils";
import { IRepositoryMembership } from "../../interfaces";
import { DTOMembership } from "./DTO";

export class ControllerMembership {
   constructor(
      private readonly planRepository: IRepositoryMembership
   ) { }

   public getAll = async (_req: Request, res: Response) => {
      try {
         const plans = await this.planRepository.getAll();

         return res.status(200).json({
            message: 'Listar todo los membresias exitosamente',
            data: plans
         })
      } catch (error) {
         return res.status(500).json({
            message: 'Error inesperado del servidor'
         })
      }
   }

   public create = async (req: Request, res: Response) => {
      try {
         const body = req.body;
         const validateDate = DTOMembership.create(body);
         const newPlan = await this.planRepository.create(validateDate);
         
         return res.status(201).json({
            message: 'Membresias creado exitosamente',
            data: newPlan
         })
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado del servidor',
            })
         }
      }
   }

   public update = async (req: Request, res: Response) => {
      try {
         const body = req.body
         const id = req.params.id
         
         const validateDate = DTOMembership.update(body)
         const updatedPlan = await this.planRepository.update(id, validateDate)

         return res.status(200).json({
            message: 'Membresias actualizado exitosamente',
            data: updatedPlan
         })

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado del servidor',
            })
         }
      }
   }
}