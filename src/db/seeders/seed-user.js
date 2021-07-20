"use strict";

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkDelete("users", {}, { truncate: true });
        await queryInterface.bulkDelete("messages", {}, { truncate: true });
        await queryInterface.bulkDelete("rooms", {}, { truncate: true });
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    uid: "c36290e7-b79b-49a7-aad6-534e42553bc5",
                    username: "admin",
                    email: "admin@node.io",
                    role: "ADMIN",
                    password: "$2b$10$7PrTqZuLv5LI0fCEQ4lo4OJd4ycn.LW8kPekjdqIbJqRvGrdrSpE.", // azerty
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    uid: "c36290e7-b79b-49a7-aad6-534e42553bc9",
                    username: "user",
                    email: "user@node.io",
                    role: "NORMAL_USER",
                    password: "$2b$10$7PrTqZuLv5LI0fCEQ4lo4OJd4ycn.LW8kPekjdqIbJqRvGrdrSpE.", // azerty
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    down: async (queryInterface) => {
        // await queryInterface.bulkDelete('User', null, {});
    },
};
