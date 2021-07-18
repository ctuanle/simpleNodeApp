import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

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

let cookie: string;

test("POST /api/auth/login", async () => {
    const res = await request(server).post("/api/auth/login").send({ username: "jtest", password: "azerty" });
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
});

test("POST /api/auth/logout", async () => {
    const res = await request(server).post("/api/auth/logout").set("Cookie", [cookie]);
    expect(res.statusCode).toBe(200);
});

test("GET /api/auth/info", async () => {
    const res = await request(server).get("/api/auth/info").set("Cookie", [cookie]);
    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toBeTruthy();
    expect(res.body.token).toBeTruthy();
    expect(res.body.role).toEqual("NORMAL_USER");
});
