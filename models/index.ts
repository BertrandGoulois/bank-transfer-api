import { Sequelize as SequelizeClass } from 'sequelize';
import dotenv from 'dotenv';
import { initUser, User } from './user';
import { initAccount, Account } from './account';
import { initTransaction, Transaction } from './transaction';

dotenv.config();

const dbName = process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME;
if (!dbName) throw new Error('DB_NAME environment variable is required');
const dbUser = process.env.DB_USER;
if (!dbUser) throw new Error('DB_USER environment variable is required');
const dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) throw new Error('DB_PASSWORD environment variable is required');
const dbHost = process.env.DB_HOST;
if (!dbHost) throw new Error('DB_HOST environment variable is required');
const dbPort = process.env.DB_PORT;
if (!dbPort) throw new Error('DB_PORT environment variable is required');

export const sequelize = process.env.DATABASE_URL
  ? new SequelizeClass(process.env.DATABASE_URL, { dialect: 'postgres', logging: false })
  : new SequelizeClass(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: parseInt(dbPort, 10),
    dialect: 'postgres',
    logging: false,
  });

export const UserModel = initUser(sequelize);
export const AccountModel = initAccount(sequelize);
export const TransactionModel = initTransaction(sequelize);

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
