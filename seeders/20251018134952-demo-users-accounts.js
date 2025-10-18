'use strict';

module.exports = {
  async up(queryInterface) {
    // Insert users
    await queryInterface.bulkInsert('Users', [
      { id: 1, name: 'Bertrand', email: 'bertrand@mail.com', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Tom', email: 'tom@mail.com', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert accounts
    await queryInterface.bulkInsert('Accounts', [
      { id: 1, userId: 1, type: 'checking', balance: 500, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, userId: 2, type: 'checking', balance: 300, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
