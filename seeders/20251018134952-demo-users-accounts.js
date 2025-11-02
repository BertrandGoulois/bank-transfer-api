'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    // Truncate tables first
    await queryInterface.bulkDelete('Accounts', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Users', null, { truncate: true, restartIdentity: true, cascade: true });

    // Hash passwords
    const passwordBertrand = await bcrypt.hash('password123', 10);
    const passwordTom = await bcrypt.hash('password123', 10);

    // Insert users
    await queryInterface.bulkInsert('Users', [
      { id: 1, name: 'Bertrand', email: 'bertrand@mail.com', password: passwordBertrand, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Tom', email: 'tom@mail.com', password: passwordTom, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert accounts
    await queryInterface.bulkInsert('Accounts', [
      { id: 1, userId: 1, type: 'checking', balance: 500, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, userId: 2, type: 'checking', balance: 300, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Accounts', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Users', null, { truncate: true, restartIdentity: true, cascade: true });
  }
};
