import { Request, Response } from 'express';
import { ILocalServiceRepository } from "../interfaces/repositories";
import { BadRequestException, extractPublicIdFromUrl, NotFoundException, UnauthorizedException, uploadToCloudinary } from '../utils';
import { LocalServiceDTO } from './local.service.DTO';
import { cloudinary } from '../config/cloudinary';


export class LocalServicesController {
   constructor(
      private readonly localServiceRepository: ILocalServiceRepository,
      private readonly nameFolder: string
   ) { }

   getAll = async (_req: Request, res: Response) => {
      try {
         const locals = await this.localServiceRepository.getAll();
         return res.status(200).json({
            message: 'Listado de Servicios exitosamente',
            data: locals
         })

      } catch (error) {
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error.message
            })
         };
      }
   };

   create = async (req: Request, res: Response) => {
      try {
         const body = req.body;
         const icon = req.file as Express.Multer.File;

         if (!icon) {
            throw new BadRequestException('Debes subir un icono');
         }
         const createDTO = LocalServiceDTO.create(body);

         // Subir el icon a cloudinary
         const iconUrl = await uploadToCloudinary(icon, this.nameFolder);
         createDTO.icon = iconUrl.secure_url;

         const newService = await this.localServiceRepository.create(createDTO);

         return res.status(201).json({
            message: 'Servicio creado exitosamente',
            data: newService
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: error.message,
            })
         }
      };
   }
   update = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const body = req.body;
         const icon = req.file as Express.Multer.File;

         if (isNaN(parseInt(id))) {
            throw new BadRequestException('id debe ser un entero');
         }

         const updateDTO = LocalServiceDTO.update(body);
         console.log(updateDTO);

         // Subir el icon a cloudinary en el caso de recibir una icono
         if (icon) {
            const iconUrl = await uploadToCloudinary(icon, this.nameFolder);
            updateDTO.icon = iconUrl.secure_url;
         }

         const { update, dataPast } = await this.localServiceRepository.update(parseInt(id), updateDTO);

         // Eliminar el icono de cloudinary en el caso de recibir un nuevo icono
         if (dataPast.icon && typeof updateDTO.icon == 'string') {
            const publicId = extractPublicIdFromUrl(dataPast.icon)
            const result = await cloudinary.uploader.destroy(publicId!);

            if (result.result !== 'ok') {
               return res.status(200).json({
                  message: 'Servicio actualizado exitosamente, el icono no se elimino de cloudinary',
                  data: result,
               })
            }
         };

         return res.status(200).json({
            message: 'Servicio actualizado exitosamente',
            data: update
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         };

         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         };

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               messge: error.message,
            })
         }

         if (error instanceof Error) {
            return res.status(500).json({
               message: error.message,
            })
         }
      }
   };

   delete = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { is_delete_definitive: definitive } = req.body;
         console.log(definitive, "definitive");

         if (typeof parseInt(id) !== 'number') {
            throw new BadRequestException('id debe ser un entero');
         }
         if (typeof definitive !== 'boolean') {
            throw new BadRequestException('is_delete_definitive es requerido');
         }

         if (typeof Boolean(definitive) !== 'boolean') {
            throw new BadRequestException('is_delete_definitive debe ser un booleano');
         }

         const deleteData = await this.localServiceRepository.delete(parseInt(id), definitive);

         // Eliminar el icono de cloudinary 
         if (deleteData.icon) {
            const publicId = extractPublicIdFromUrl(deleteData.icon)
            const result = await cloudinary.uploader.destroy(publicId!);

            if (result.result !== 'ok') {
               return res.status(200).json({
                  message: 'Servicio eliminado exitosamente, el icono no se elimino de cloudinary',
                  data: true,
               })
            }
         };

         return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: true,
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               messge: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error
            });
         }
      }
   }
}