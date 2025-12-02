import { Sequelize as SequelizeClass } from 'sequelize';
import config from '../config/config';
import dotenv from 'dotenv';
import { initUser, initAccountModel, initTransaction } from './models';
dotenv.config();

const env = (process.env.NODE_ENV || 'development') as
  'development' | 'test' | 'production';

type PostgresConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging: boolean;
};

type SQLiteConfig = {
  dialect: 'sqlite';
  storage: string;
  logging: boolean;
};

type DBConfig = PostgresConfig | SQLiteConfig;

const dbConfig: DBConfig = config[env] as DBConfig;

const isSQLite = dbConfig.dialect === 'sqlite';

export const sequelize = isSQLite
  ? new SequelizeClass({
      dialect: 'sqlite',
      storage: (dbConfig as SQLiteConfig).storage,
      logging: dbConfig.logging,
    })
  : new SequelizeClass(
      (dbConfig as PostgresConfig).database,
      (dbConfig as PostgresConfig).username,
      (dbConfig as PostgresConfig).password,
      {
        host: (dbConfig as PostgresConfig).host,
        port: (dbConfig as PostgresConfig).port,
        dialect: 'postgres',
        logging: false,
      }
    );

export const UserModel = initUser(sequelize);
export const AccountModel = initAccountModel(sequelize);
export const TransactionModel = initTransaction(sequelize);

UserModel.associate({ Account: AccountModel, Transaction: TransactionModel });
AccountModel.associate({ UserModel, TransactionModel });
TransactionModel.associate({ Account: AccountModel });
