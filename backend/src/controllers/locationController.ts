import { Request, Response, NextFunction } from 'express';
import { listLocations } from '../services/locationService';

export const getLocationsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await listLocations();
    res.json(
      locations.map((location) => ({
        id: location.id,
        name: location.name
      }))
    );
  } catch (error) {
    next(error);
  }
};

