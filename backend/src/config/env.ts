import dotenv from 'dotenv';

dotenv.config();

const required = (value: string | undefined, label: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }
  return value;
};

const getNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable expected to be numeric but received: ${value}`);
  }
  return parsed;
};

export const appConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: getNumber(process.env.PORT, 4000),
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  },
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: getNumber(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: (process.env.DB_LOGGING ?? 'false').toLowerCase() === 'true'
  },
  seed: {
    recordCount: getNumber(process.env.SEED_RECORDS, 500_000),
    batchSize: getNumber(process.env.SEED_BATCH_SIZE, 5_000)
  }
};

export const resolveDbConfig = () => {
  if (appConfig.database.url) {
    return {
      url: appConfig.database.url,
      logging: appConfig.database.logging
    };
  }

  return {
    host: required(appConfig.database.host, 'DB_HOST'),
    port: appConfig.database.port,
    database: required(appConfig.database.name, 'DB_NAME'),
    username: required(appConfig.database.username, 'DB_USER'),
    password: required(appConfig.database.password, 'DB_PASSWORD'),
    logging: appConfig.database.logging
  };
};

