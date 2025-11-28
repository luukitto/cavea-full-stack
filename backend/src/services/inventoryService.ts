import { col, fn, Order } from 'sequelize';
import { Inventory, Location } from '../models';

export type SortField = 'name' | 'price' | 'location';
export type SortDirection = 'asc' | 'desc';

export interface InventoryListParams {
  page: number;
  pageSize: number;
  locationId?: number;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const listInventories = async ({
  page,
  pageSize,
  locationId,
  sortField,
  sortDirection
}: InventoryListParams) => {
  const where = locationId
    ? {
        locationId
      }
    : undefined;

  const order: Order = (() => {
    if (sortField === 'location') {
      return [[{ model: Location, as: 'location' }, 'name', sortDirection]];
    }
    return [[sortField, sortDirection]];
  })();

  const { rows, count } = await Inventory.findAndCountAll({
    where,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    include: [
      {
        model: Location,
        as: 'location',
        attributes: ['id', 'name']
      }
    ],
    order
  });

  return { items: rows, total: count };
};

export const createInventory = (payload: {
  name: string;
  price: number;
  locationId: number;
}) =>
  Inventory.create({
    name: payload.name,
    price: payload.price,
    locationId: payload.locationId
  });

export const deleteInventory = async (id: number) => {
  const deleted = await Inventory.destroy({
    where: { id }
  });
  return deleted > 0;
};

export const getInventoryStatistics = () =>
  Inventory.findAll({
    attributes: [
      [col('Inventory.location_id'), 'locationId'],
      [fn('COUNT', col('Inventory.id')), 'itemCount'],
      [fn('COALESCE', fn('SUM', col('Inventory.price')), 0), 'totalPrice']
    ],
    include: [
      {
        model: Location,
        as: 'location',
        attributes: ['id', 'name']
      }
    ],
    group: ['Inventory.location_id', 'location.id', 'location.name'],
    order: [[{ model: Location, as: 'location' }, 'name', 'ASC']]
  });

