import { PoolClient } from 'pg';

import { EnvConfig } from '.';

export const reader = async (): Promise<PoolClient> => 
  EnvConfig.readDatabasePool.connect();

export const writer = async (): Promise<PoolClient> => 
  EnvConfig.writeDatabasePool.connect();

export const endDbPools = async () => {
  await EnvConfig.readDatabasePool.end();
  await EnvConfig.writeDatabasePool.end();
}