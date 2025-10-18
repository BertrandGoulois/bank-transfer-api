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
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: DataTypes.STRING,
      amount: DataTypes.DECIMAL(12, 2),
      description: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Transaction',
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }
  );

  return Transaction;
};
