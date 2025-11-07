import { Model, DataTypes, Sequelize, Optional, ModelStatic } from 'sequelize';
import { User } from './user';
import { Transaction } from './transaction';

export interface AccountAttributes {
  id: number;
  userId: number;
  balance: string | number;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountCreationAttributes extends Optional<AccountAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: number;
  public userId!: number;
  public balance!: string;
  public type?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: { User: ModelStatic<User>; Transaction: ModelStatic<Transaction> }) {
    Account.belongsTo(models.User, { foreignKey: 'userId' });
    Account.hasMany(models.Transaction, { foreignKey: 'accountId' });
  }
}

export function initAccount(sequelize: Sequelize): typeof Account {
  Account.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        get() {
          const value = this.getDataValue('balance');
          return value !== null && value !== undefined ? parseFloat(value.toString()) : 0;
        },
      },
      type: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'Accounts',
    }
  );

  return Account;
}
