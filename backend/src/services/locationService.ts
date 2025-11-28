import { Op } from 'sequelize';
import { Location } from '../models';

export const DEFAULT_LOCATIONS = [
  'Main Office',
  'Cavea Galleria',
  'Cavea Tbilisi Mall',
  'Cavea East Point',
  'Cavea City Mall'
];

export const ensureDefaultLocations = async () => {
  const existing = await Location.findAll({
    where: {
      name: {
        [Op.in]: DEFAULT_LOCATIONS
      }
    }
  });

  const existingNames = new Set(existing.map((loc) => loc.name));
  const missing = DEFAULT_LOCATIONS.filter((loc) => !existingNames.has(loc));

  if (!missing.length) {
    return;
  }

  await Location.bulkCreate(
    missing.map((name) => ({
      name
    }))
  );
};

export const listLocations = () =>
  Location.findAll({
    order: [['name', 'ASC']]
  });

export const getLocationById = (id: number) =>
  Location.findByPk(id, {
    rejectOnEmpty: false
  });

