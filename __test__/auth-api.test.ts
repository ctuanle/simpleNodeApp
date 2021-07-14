import server from '../app';
import request from 'supertest';
import { sequelizeJTest } from "../src/db/models"; 

beforeAll(async () => {
    await sequelizeJTest.authenticate();
    await sequelizeJTest.sync({ alter: true });
});

afterAll(async () => {
    await sequelizeJTest.close();
});

test("POST /auth/sigup", async () => {
    const res = await request(server).post("/auth/signup")
                .send({username: "jtest", email: "", password: "azerty"});
    expect(res.statusCode).toBe(201);
});

test("POST /auth/login", async () => {
    const res = await request(server).post("/auth/login")
                .send({username: "cole", password: "azerty"});
    expect(res.statusCode).toBe(200);
});