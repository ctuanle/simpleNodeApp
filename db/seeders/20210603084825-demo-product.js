'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Product1',
        price: 19,
        category: 'book',
        images : '',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Product2',
        price: 299,
        category: 'phone',
        images : '',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Product3',
        price: 1999,
        category: 'laptop',
        images : '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    //await queryInterface.bulkDelete('Product', null, {});
  }
};
