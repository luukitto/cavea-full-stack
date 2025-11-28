import '../src/config/env';
import { sequelize } from '../src/database';
import { Inventory, Location } from '../src/models';
import { ensureDefaultLocations } from '../src/services/locationService';
import { appConfig } from '../src/config/env';
import { initDatabase } from '../src/database';

const shouldReset = (process.env.SEED_RESET ?? 'true').toLowerCase() === 'true';

const getRandomPrice = () => Number((Math.random() * 4999 + 1).toFixed(2));

const main = async () => {
  console.time('seed');
  await initDatabase();
  await ensureDefaultLocations();

  const locations = await Location.findAll();
  if (!locations.length) {
    throw new Error('Unable to seed data because no locations exist.');
  }

  if (shouldReset) {
    await Inventory.destroy({ where: {} });
  }

  const totalRecords = appConfig.seed.recordCount;
  const batchSize = appConfig.seed.batchSize;
  let processed = 0;

  while (processed < totalRecords) {
    const currentBatchSize = Math.min(batchSize, totalRecords - processed);
    const batch = Array.from({ length: currentBatchSize }, (_, idx) => {
      const location = locations[(processed + idx) % locations.length];
      return {
        name: `Inventory Item #${processed + idx + 1}`,
        price: getRandomPrice(),
        locationId: location.id
      };
    });

    await Inventory.bulkCreate(batch, { validate: false });
    processed += currentBatchSize;
    process.stdout.write(`\rInserted ${processed.toLocaleString()} / ${totalRecords.toLocaleString()} records`);
  }

  console.log('\nSeeding complete.');
  console.timeEnd('seed');
  await sequelize.close();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

