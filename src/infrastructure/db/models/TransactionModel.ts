import { Model, DataTypes, Sequelize, Optional, ModelStatic } from 'sequelize';
import { AccountModel } from './AccountModel';

export interface TransactionAttributes {
  id: number;
  accountId: number;
  type: string;
  amount: string | number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class TransactionModel extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public accountId!: number;
  public type!: string;
  public amount!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: { Account: ModelStatic<AccountModel> }) {
    TransactionModel.belongsTo(models.Account, { foreignKey: 'accountId' });
  }
}

export function initTransaction(sequelize: Sequelize): typeof TransactionModel {
  TransactionModel.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      accountId: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        get() {
          const value = this.getDataValue('amount');
          return value !== null && value !== undefined ? parseFloat(value.toString()) : 0;
        },
      },
      description: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'Transactions',
    }
  );

  return TransactionModel;
}
