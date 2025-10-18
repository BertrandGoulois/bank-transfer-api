'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: { 
        allowNull: false, 
        primaryKey: true, 
        type: Sequelize.INTEGER, 
        autoIncrement: true 
      },
      userId: { 
        type: Sequelize.INTEGER, 
        references: { model: 'Users', key: 'id' }, 
        allowNull: false 
      },
      balance: { type: Sequelize.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      type: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('NOW()') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Accounts');
  }
};
