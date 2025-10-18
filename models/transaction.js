'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Account, { foreignKey: 'accountId' });
    }
  }

  Transaction.init(
    {
      accountId: DataTypes.UUID,
      type: DataTypes.STRING,
      amount: DataTypes.DECIMAL(12,2),
      description: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Transaction'
    }
  );

  return Transaction;
};
