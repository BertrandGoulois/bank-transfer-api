'use strict';

module.exports = {
  async up(queryInterface) {
    // Insert users
    await queryInterface.bulkInsert('Users', [
      { id: '11111111-1111-1111-1111-111111111111', name: 'Bertrand', email: 'bertrand@mail.com', createdAt: new Date(), updatedAt: new Date() },
      { id: '22222222-2222-2222-2222-222222222222', name: 'Tom', email: 'tom@mail.com', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert accounts
    await queryInterface.bulkInsert('Accounts', [
      { id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', userId: '11111111-1111-1111-1111-111111111111', type: 'checking', balance: 500, createdAt: new Date(), updatedAt: new Date() },
      { id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', userId: '22222222-2222-2222-2222-222222222222', type: 'checking', balance: 300, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
