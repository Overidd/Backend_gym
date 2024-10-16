import { Router } from 'express';
import { LocalServicesController, ServiceRepository, ClasesRepository } from '.';
import multer from 'multer';

const storageFile = multer.memoryStorage();
const upload = multer({ storage: storageFile });

export class LocalServiceRouter {
   public get router(): Router {
      const router = Router();

      const serviceRepository = new ServiceRepository();
      const localServiceController = new LocalServicesController(serviceRepository, 'services');

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
      const localServiceController = new LocalServicesController(clasesRepository, 'clases');

      router.get('/all', localServiceController.getAll);

      router.post('/create', upload.single('icon'), localServiceController.create);

      router.put('/update/:id', upload.single('icon'),localServiceController.update);

      router.delete('/delete/:id', localServiceController.delete);

      return router
   }
}
