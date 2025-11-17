import { Sequelize as SequelizeClass } from 'sequelize';
import config from '../config/config';
import dotenv from 'dotenv';
import { initUser, User } from './user';
import { initAccount, Account } from './account';
import { initTransaction, Transaction } from './transaction';

dotenv.config();

// Select config based on NODE_ENV
const env = (process.env.NODE_ENV || 'development') as 'development' | 'test' | 'production';
const dbConfig = config[env];

// Type guard for SQLite config
const isSQLite = (cfg: typeof dbConfig): cfg is typeof config.test => {
  return cfg.dialect === 'sqlite';
};

export const sequelize = isSQLite(dbConfig)
  ? new SequelizeClass({
      dialect: 'sqlite',
      storage: dbConfig.storage,
      logging: dbConfig.logging,
    })
  : new SequelizeClass(dbConfig.database!, dbConfig.username!, dbConfig.password!, {
      host: dbConfig.host!,
      port: dbConfig.port!,
      dialect: dbConfig.dialect as 'postgres',
      logging: false,
    });

// Initialize models
export const UserModel = initUser(sequelize);
export const AccountModel = initAccount(sequelize);
export const TransactionModel = initTransaction(sequelize);

// Set up associations
UserModel.associate({ Account: AccountModel, Transaction: TransactionModel });
AccountModel.associate({ User: UserModel, Transaction: TransactionModel });
TransactionModel.associate({ Account: AccountModel });

export { User, Account, Transaction };
export const Sequelize = SequelizeClass;

export default {
  User: UserModel,
  Account: AccountModel,
  Transaction: TransactionModel,
  sequelize,
  Sequelize,
};
