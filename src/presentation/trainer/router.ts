import { Router } from 'express';
import multer from 'multer';
import { TrainerController, TrainerRepository } from '.';
import { Cloudinary } from '../../services';
import { envs } from '../../config';

const storageFile = multer.memoryStorage();
const upload = multer({ storage: storageFile });

export class TrainerRouter {

   public get router(): Router {

      const router = Router();
      const cloudinary = new Cloudinary(envs.cloud_activate)
      const repository = new TrainerRepository()
      const controller = new TrainerController(repository, cloudinary);

      router.get('/all', controller.getAllTrainers)

      router.post('/create', upload.single('image'), controller.createTrainer)

      router.put('/update/:id', upload.single('image'), controller.updateTrainer)

      router.delete('/delete/:id', controller.deleteTrainer)

      return router
   }
}
