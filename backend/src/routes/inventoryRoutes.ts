import { Router } from 'express';
import {
  createInventoryHandler,
  deleteInventoryHandler,
  getInventoriesHandler,
  getInventoryStatsHandler
} from '../controllers/inventoryController';

export const inventoryRouter = Router();

inventoryRouter.get('/', getInventoriesHandler);
inventoryRouter.post('/', createInventoryHandler);
inventoryRouter.delete('/:id', deleteInventoryHandler);
inventoryRouter.get('/statistics', getInventoryStatsHandler);

