import { Router } from 'express'
import { LocalController, LocalRepository } from '.';
import multer from 'multer';
import { Cloudinary } from '../../services';
import { envs } from '../../config';

const storageFile = multer.memoryStorage();
const upload = multer({ storage: storageFile });

export class LocalRouter {
   public get router(): Router {
      const router = Router();
      const localRepository = new LocalRepository()
      const cloudinary = new Cloudinary(envs.cloud_activate)
      const controller = new LocalController(localRepository, cloudinary);

      router.get('/all', controller.getAll);

      router.get('/get/:id', controller.getById);

      router.post('/create', upload.array('images'), controller.create);

      router.put('/update/:id', upload.array('images'), controller.update);

      router.put('/image/default/:id', controller.updateImageDefault);

      router.put('/activate/:id', controller.isActivate);

      router.delete('/delete/:id', controller.delete);

      router.delete('/delete/image/:id', controller.deleteImage);

      router.delete('/delete/service/:id', controller.deleteService);

      router.delete('/delete/class/:id', controller.deleteClases);

      return router;
   };
}