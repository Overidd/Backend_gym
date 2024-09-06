import { Server } from './presentation/server';
import { AppRouter } from './presentation/router';
import { envs } from './config';


(async () => {
   const server = new Server(envs.PORT, AppRouter.router)
   server.start();
   
})()

