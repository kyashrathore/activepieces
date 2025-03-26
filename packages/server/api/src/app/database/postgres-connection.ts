import { TlsOptions } from 'node:tls';
import { AppSystemProp } from '@activepieces/server-shared';
import { ApEdition, ApEnvironment, isNil } from '@activepieces/shared';
import { DataSource, MigrationInterface } from 'typeorm';
import { system } from '../helper/system/system';
import { commonProperties } from './database-connection';
import { InitialSchema1742432169256 } from './migration/postgres/1742432169256-InitialSchema';

const getSslConfig = (): boolean | TlsOptions => {
  const useSsl = system.get(AppSystemProp.POSTGRES_USE_SSL);
  if (useSsl === 'true') {
    return {
      ca: system.get(AppSystemProp.POSTGRES_SSL_CA)?.replace(/\\n/g, '\n'),
    };
  }
  return false;
};

const getMigrations = (): (new () => MigrationInterface)[] => {
  const commonMigration = [
    InitialSchema1742432169256,
  ];

  return commonMigration;
};

const getMigrationConfig = (): MigrationConfig => {
  const env = system.getOrThrow<ApEnvironment>(AppSystemProp.ENVIRONMENT);

  if (env === ApEnvironment.TESTING) {
    return {};
  }

  return {
    migrationsRun: true,
    migrationsTransactionMode: 'each',
    migrations: getMigrations(),
  };
};

export const createPostgresDataSource = (): DataSource => {
  console.log('createPostgresDataSource');
  const migrationConfig = getMigrationConfig();
  const url = system.get(AppSystemProp.POSTGRES_URL);
  if (!isNil(url)) {
    console.log('createPostgresDataSource', url);
    return new DataSource({
      type: 'postgres',
      url,
      ssl: getSslConfig(),
      ...migrationConfig,
      ...commonProperties,
    });
  }

  const database = system.getOrThrow(AppSystemProp.POSTGRES_DATABASE);
  const host = system.getOrThrow(AppSystemProp.POSTGRES_HOST);
  const password = system.getOrThrow(AppSystemProp.POSTGRES_PASSWORD);
  const serializedPort = system.getOrThrow(AppSystemProp.POSTGRES_PORT);
  const port = Number.parseInt(serializedPort, 10);
  const username = system.getOrThrow(AppSystemProp.POSTGRES_USERNAME);

  return new DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    ssl: getSslConfig(),
    ...migrationConfig,
    ...commonProperties,
  });
};

type MigrationConfig = {
  migrationsRun?: boolean;
  migrationsTransactionMode?: 'all' | 'none' | 'each';
  migrations?: (new () => MigrationInterface)[];
};
