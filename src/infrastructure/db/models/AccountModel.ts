import { Model, DataTypes, Sequelize, Optional, ModelStatic } from 'sequelize';
import { UserModel } from './UserModel';
import { TransactionModel } from './TransactionModel';

export interface AccountAttributes {
  id: number;
  userId: number;
  balance: string | number;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountCreationAttributes
  extends Optional<AccountAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class AccountModel
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: number;
  public userId!: number;
  public balance!: string;
  public type?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: {
    UserModel: ModelStatic<UserModel>;
    TransactionModel: ModelStatic<TransactionModel>;
  }) {
    AccountModel.belongsTo(models.UserModel, { foreignKey: 'userId' });
    AccountModel.hasMany(models.TransactionModel, { foreignKey: 'accountId' });
  }
}

export function initAccountModel(sequelize: Sequelize): typeof AccountModel {
  AccountModel.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        get() {
          const value = this.getDataValue('balance');
          return value !== null && value !== undefined
            ? parseFloat(value.toString())
            : 0;
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

  return AccountModel;
}
