import { Sequelize } from 'sequelize';
import { appConfig, resolveDbConfig } from '../config/env';
import { initModels } from '../models';

const connectionSettings = resolveDbConfig();

export const sequelize =
  'url' in connectionSettings
    ? new Sequelize(connectionSettings.url, {
        dialect: 'postgres',
        logging: connectionSettings.logging
      })
    : new Sequelize(
        connectionSettings.database,
        connectionSettings.username,
        connectionSettings.password,
        {
          host: connectionSettings.host,
          port: connectionSettings.port,
          dialect: 'postgres',
          logging: connectionSettings.logging
        }
      );

export const initDatabase = async () => {
  initModels(sequelize);
  await sequelize.authenticate();
  await sequelize.sync();
  if (appConfig.nodeEnv !== 'test') {
    console.info('Database connection established.');
  }
};

