'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: { allowNull: false, primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()') },
      accountId: { type: Sequelize.UUID, references: { model: 'Accounts', key: 'id' }, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(12,2), allowNull: false },
      description: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Transactions');
  }
};
