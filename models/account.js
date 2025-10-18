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
      userId: DataTypes.UUID,
      balance: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
      type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Account'
    }
  );

  return Account;
};
