/*
import { PoolClient } from 'pg';

import { EnvConfig } from '.';

export const walletReader = async (): Promise<PoolClient> => 
  EnvConfig.walletReadDatabasePool.connect();

export const walletWriter = async (): Promise<PoolClient> => 
  EnvConfig.walletWriteDatabasePool.connect();

export const endDbPools = async () => {
  await EnvConfig.walletReadDatabasePool.end();
  await EnvConfig.walletWriteDatabasePool.end();
}
*/