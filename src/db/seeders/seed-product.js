"use strict";

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkDelete("products", {}, { truncate: true });
        await queryInterface.bulkInsert(
            "products",
            [
                {
                    name: "Product1",
                    price: 19,
                    category: "Book",
                    images: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Product2",
                    price: 299,
                    category: "Phone",
                    images: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Product3",
                    price: 1999,
                    category: "Laptop",
                    images: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        // await queryInterface.bulkDelete('Product', null, {});
    },
};
