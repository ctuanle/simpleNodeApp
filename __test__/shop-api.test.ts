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


test('SHOP GET /', async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
});
 
test("SHOP GET /product/:pid", async () => {
    const res = await request(server).get("/product/1");
    expect(res.statusCode).toBe(200);
});

test("SHOP GET /product/page/:page", async () => {
    const res = await request(server).get("/product/page/1");
    expect(res.statusCode).toBe(200);
});

test("SHOP GET /category", async () => {
    const res = await request(server).get("/category");
    expect(res.statusCode).toBe(200);
});

test("SHOP GET /category/:cat", async () => {
    const res = await request(server).get("/category/book");
    expect(res.headers['content-type']).toEqual("text/html; charset=utf-8");
    expect(res.statusCode).toBe(200);
});

test("SHOP GET /message/:uid", async () => {
    const res = await request(server).get("/message/:uid");
    expect(res.statusCode).toBe(401);
})