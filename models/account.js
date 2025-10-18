'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.belongsTo(models.User, { foreignKey: 'userId' });
      Account.hasMany(models.Transaction, { foreignKey: 'accountId' });
    }
  }

  Account.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Account',
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }
  );

  return Account;
};
