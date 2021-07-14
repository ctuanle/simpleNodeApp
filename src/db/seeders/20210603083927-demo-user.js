"use strict";

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    username: "admin",
                    email: "admin@node.io",
                    isAdmin: true,
                    password:
                        "$2b$10$7PrTqZuLv5LI0fCEQ4lo4OJd4ycn.LW8kPekjdqIbJqRvGrdrSpE.", //azerty
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    username: "user",
                    email: "user@node.io",
                    isAdmin: false,
                    password:
                        "$2b$10$7PrTqZuLv5LI0fCEQ4lo4OJd4ycn.LW8kPekjdqIbJqRvGrdrSpE.", //azerty
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        //await queryInterface.bulkDelete('User', null, {});
    },
};
