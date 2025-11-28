import { createApp } from './app';
import { appConfig } from './config/env';
import { initDatabase } from './database';
import { ensureDefaultLocations } from './services/locationService';

const bootstrap = async () => {
  await initDatabase();
  await ensureDefaultLocations();

  const app = createApp();
  app.listen(appConfig.port, () => {
    console.log(`API server listening on http://localhost:${appConfig.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

