import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

beforeAll(async () => {
    await sequeSync(sequelize);
});

afterAll(async () => {
    await sequelize.close();
});

test("POST /auth/signup", async () => {
    const res = await request(server)
        .post("/auth/signup")
        .send({ username: "jtest", email: "", password: "azerty" });
    expect(res.statusCode).toBe(201);
});

test("POST /auth/login", async () => {
    const res = await request(server)
        .post("/auth/login")
        .send({ username: "cole", password: "azerty" });
    expect(res.statusCode).toBe(200);
});
