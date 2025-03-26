import { AppSystemProp } from '@activepieces/server-shared';
import { ApEdition, ApEnvironment, isNil } from '@activepieces/shared';
import {
  ArrayContains,
  DataSource,
  EntitySchema,
  FindOperator,
  Raw,
} from 'typeorm';
import { AppConnectionEntity } from '../app-connection/app-connection.entity';

import { DatabaseType, system } from '../helper/system/system';
import { FlagEntity } from '../flag/flag.entity';
import { PieceMetadataEntity } from '../pieces/piece-metadata-entity';

import { createPostgresDataSource } from './postgres-connection';
import { createSqlLiteDataSource } from './sqlite-connection';

const databaseType = system.get(AppSystemProp.DB_TYPE);

function getEntities(): EntitySchema<unknown>[] {

  const entities: EntitySchema[] = [AppConnectionEntity, PieceMetadataEntity, FlagEntity];

  return entities;
}

const getSynchronize = (): boolean => {
  // Force synchronize to true for all environments to recreate tables
  return true;
};

export const commonProperties = {
  subscribers: [],
  entities: getEntities(),
  synchronize: getSynchronize(),
};

let _databaseConnection: DataSource | null = null;

export const databaseConnection = () => {
  if (isNil(_databaseConnection)) {
    _databaseConnection =
      databaseType === DatabaseType.SQLITE3
        ? createSqlLiteDataSource()
        : createPostgresDataSource();
  }
  return _databaseConnection;
};

export function APArrayContains<T>(
  columnName: string,
  values: string[]
): Record<string, FindOperator<T>> {
  const databaseType = system.get(AppSystemProp.DB_TYPE);
  switch (databaseType) {
    case DatabaseType.POSTGRES:
      return {
        [columnName]: ArrayContains(values),
      };
    case DatabaseType.SQLITE3: {
      const likeConditions = values
        .map((_, index) => `${columnName} LIKE :value${index}`)
        .join(' AND ');
      const likeParams = values.reduce((params, value, index) => {
        params[`value${index}`] = `%${value}%`;
        return params;
      }, {} as Record<string, string>);
      return {
        [columnName]: Raw((_) => `(${likeConditions})`, likeParams),
      };
    }
    default:
      throw new Error(`Unsupported database type: ${databaseType}`);
  }
}

// Uncomment the below line when running `nx db-migration server-api name=<MIGRATION_NAME>` and recomment it after the migration is generated
// export const exportedConnection = databaseConnection()
