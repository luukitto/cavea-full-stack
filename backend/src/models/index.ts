import { Sequelize } from 'sequelize';
import { Inventory, initInventoryModel } from './inventory';
import { Location, initLocationModel } from './location';

let initialized = false;

export const initModels = (sequelize: Sequelize) => {
  if (initialized) {
    return;
  }

  initLocationModel(sequelize);
  initInventoryModel(sequelize);

  Location.hasMany(Inventory, {
    as: 'inventories',
    foreignKey: 'locationId'
  });

  Inventory.belongsTo(Location, {
    as: 'location',
    foreignKey: 'locationId'
  });

  initialized = true;
};

export { Inventory, Location };

