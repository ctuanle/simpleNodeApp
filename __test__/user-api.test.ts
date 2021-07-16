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
    const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "jtest", password: "azerty" });
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
});

let uid:string;

test("GET /api/user/five", async () => {
    const res = await request(server)
        .get("/api/user/five")
        .set("Cookie", [cookie]);
    
    expect(res.statusCode).toBe(200);
    uid = res.body[0].uid;
    expect(res.body[0].uid).toBeTruthy();
});

test("GET /api/user/count", async () => {
    const res = await request(server)
        .get("/api/user/count")
        .set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
});

test("GET /api/user/:uid", async () => {
    const res = await request(server)
        .get("/api/user/"+uid)
        .set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toEqual(uid);
})

