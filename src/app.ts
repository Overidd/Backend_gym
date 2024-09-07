import { Server } from './server';
import { AppRouter } from './app.router';
import { envs } from './config';


(async () => {
   const server = new Server(envs.PORT, AppRouter.router)
   server.start();
})()

