import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { appConfig } from '../config/env';
import {
  createInventory,
  deleteInventory,
  getInventoryStatistics,
  listInventories
} from '../services/inventoryService';
import { getLocationById } from '../services/locationService';

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z
    .coerce.number()
    .int()
    .positive()
    .max(appConfig.pagination.maxPageSize)
    .default(appConfig.pagination.defaultPageSize),
  locationId: z.coerce.number().int().positive().optional(),
  sortField: z.enum(['name', 'price', 'location']).default('name'),
  sortDirection: z.enum(['asc', 'desc']).default('asc')
});

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().positive(),
  locationId: z.number().int().positive()
});

export const getInventoriesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = querySchema.parse(req.query);

    const { items, total } = await listInventories(query);
    const normalizedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      location: item.location
        ? {
            id: item.location.id,
            name: item.location.name
          }
        : null
    }));

    res.json({
      data: normalizedItems,
      meta: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createInventoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = bodySchema.parse({
      ...req.body,
      price: Number(req.body?.price)
    });

    const location = await getLocationById(payload.locationId);
    if (!location) {
      return res.status(400).json({
        message: 'Selected location does not exist.'
      });
    }

    const inventory = await createInventory(payload);
    res.status(201).json({
      id: inventory.id,
      name: inventory.name,
      price: Number(inventory.price),
      locationId: inventory.locationId
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInventoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = z.object({
      id: z.coerce.number().int().positive()
    });
    const { id } = schema.parse(req.params);

    const removed = await deleteInventory(id);
    if (!removed) {
      return res.status(404).json({ message: 'Inventory not found.' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getInventoryStatsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getInventoryStatistics();
    res.json(
      stats.map((row) => ({
        locationId: row.locationId,
        locationName: row.location?.name ?? 'Unknown',
        itemCount: Number(row.getDataValue('itemCount')),
        totalPrice: Number(row.getDataValue('totalPrice'))
      }))
    );
  } catch (error) {
    next(error);
  }
};

