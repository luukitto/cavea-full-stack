import { Router } from 'express';
import { getLocationsHandler } from '../controllers/locationController';

export const locationRouter = Router();

locationRouter.get('/', getLocationsHandler);

