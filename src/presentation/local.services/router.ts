import { Router } from 'express';
import multer from 'multer';
import { LocalServicesController, ServiceRepository, ClasesRepository } from '.';
import { Cloudinary } from '../../services';
import { envs } from '../../config';

const storageFile = multer.memoryStorage();
const upload = multer({ storage: storageFile });

const cloudinary = new Cloudinary(envs.cloud_activate)
export class LocalServiceRouter {
   public get router(): Router {
      const router = Router();

      const serviceRepository = new ServiceRepository();
      const localServiceController = new LocalServicesController(serviceRepository, cloudinary,'services');

      router.get('/all', localServiceController.getAll);

      router.post('/create', upload.single('icon'), localServiceController.create);

      router.put('/update/:id', upload.single('icon'),localServiceController.update);

      router.delete('/delete/:id', localServiceController.delete);

      return router 
   }
}

export class LocalClaseRouter {
   public get router(): Router {
      const router = Router();
      const clasesRepository = new ClasesRepository();
      const localServiceController = new LocalServicesController(clasesRepository, cloudinary,'clases');

      router.get('/all', localServiceController.getAll);

      router.post('/create', upload.single('icon'), localServiceController.create);

      router.put('/update/:id', upload.single('icon'),localServiceController.update);

      router.delete('/delete/:id', localServiceController.delete);

      return router
   }
}
