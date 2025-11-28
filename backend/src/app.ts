import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { inventoryRouter } from './routes/inventoryRoutes';
import { locationRouter } from './routes/locationRoutes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/inventories', inventoryRouter);
  app.use('/locations', locationRouter);

  app.use(errorHandler);

  return app;
};

