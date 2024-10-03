import express, { Router } from 'express';
import cors from 'cors';

export default function (router :Router): express.Express {
    const app = express();

    app.disable('x-powered-by');
    app.use(express.json());
    app.use(cors());
    app.use('/api/product', router);

    return app;
}
