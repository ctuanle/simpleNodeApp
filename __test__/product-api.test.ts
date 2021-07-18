import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";
import { UserModel } from "../src/db/models/user.model";

beforeAll(async () => {
    await sequeSync(sequelize);
});

afterAll(async () => {
    await sequelize.close();
});

test("POST /api/auth/signup", async () => {
    const res = await request(server)
        .post("/api/auth/signup")
        .send({ username: "jtest", email: "", password: "azerty" });
    expect(res.statusCode).toBe(201);
});

test("BECOME ADMIN", async () => {
    await UserModel.update({ role: "ADMIN" }, { where: { username: "jtest" } });
});

let cookie: string;

test("POST /api/auth/login", async () => {
    const res = await request(server).post("/api/auth/login").send({ username: "jtest", password: "azerty" });
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
});

test("POST /api/product/add", async () => {
    const res = await request(server)
        .post("/api/product/add")
        .set("Cookie", [cookie])
        .send({ name: "Test1", price: 123, category: "Book", images: "" });
    expect(res.statusCode).toBe(201);
});

test("POST /api/product/add", async () => {
    const res = await request(server)
        .post("/api/product/add")
        .set("Cookie", [cookie])
        .send({ name: "Test2", price: 123, category: "Phone", images: "" });
    expect(res.statusCode).toBe(201);
});

test("GET /api/product/:pid", async () => {
    const res = await request(server).get("/api/product/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.pid).toBeTruthy();
});

test("GET /api/product/page/1", async () => {
    const res = await request(server).get("/api/product/page/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.numpage).toBe(1);
    expect(res.body.products.length).toBe(2);
});

test("GET /api/category/all", async () => {
    const res = await request(server).get("/api/product/category/all");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(["Uncategorized", "Book", "Phone", "Laptop"]);
});

test("GET /api/category/:cat", async () => {
    const res = await request(server).get("/api/product/category/Phone");
    expect(res.statusCode).toBe(200);
    expect(res.body.cats).toMatchObject(["Uncategorized", "Book", "Phone", "Laptop"]);
    expect(res.body.products.length).toBe(1);
});

test("PUT /api/product/:pid", async () => {
    const res = await request(server)
        .put("/api/product/1")
        .set("Cookie", [cookie])
        .send({ name: "Test1", price: 789, category: "Book", images: "" });
    expect(res.statusCode).toBe(200);
});

test("GET /api/product/count", async () => {
    const res = await request(server).get("/api/product/count/all").set("Cookie", [cookie]);
    expect(res.body.count).toBe(2);
});

test("DELETE /api/product/:pid", async () => {
    const res = await request(server).delete("/api/product/2").set("Cookie", [cookie]).send({ pid: 1 });
    expect(res.statusCode).toBe(200);
});
