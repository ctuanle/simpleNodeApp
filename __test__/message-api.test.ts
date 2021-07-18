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
        .send({ username: "admin", email: "", password: "azerty" });
    expect(res.statusCode).toBe(201);
});

test("BECOME ADMIN", async () => {
    await UserModel.update({ role: "ADMIN" }, { where: { username: "admin" } });
});

let cookie: string;
test("POST /api/auth/login", async () => {
    const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "azerty" });
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
});

test("POST /api/auth/signup", async () => {
    const res = await request(server)
        .post("/api/auth/signup")
        .send({ username: "user", email: "", password: "azerty" });
    expect(res.statusCode).toBe(201);
});

let uid: string;
test("GET /api/user/username/:username", async () => {
    const res = await request(server).get("/api/user/username/user").set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toBeTruthy();
    expect(res.body.username).toEqual("user");
    uid = res.body.uid;
});

let aid: string;
test("GET /api/user/username/:username", async () => {
    const res = await request(server).get("/api/user/username/admin").set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toBeTruthy();
    expect(res.body.username).toEqual("admin");
    aid = res.body.uid;
});

test("POST /api/room/add", async () => {
    const res = await request(server)
        .post("/api/room/add")
        .set("Cookie", [cookie])
        .send({ uid: uid, username: "user" });

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toEqual(uid);
    expect(res.body.rid).toBeTruthy();
});

test("POST /api/message/add", async () => {
    const res = await request(server)
        .post("/api/message/add")
        .set("Cookie", [cookie])
        .send({ sid: aid, rid: uid, message: "Hello", roomId: 1 });

    expect(res.statusCode).toBe(200);
});

test("GET /api/message/count", async () => {
    const res = await request(server).get("/api/message/count").set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
});

test("GET /api/messages/latest15", async () => {
    const res = await request(server).get("/api/message/latest15").set("Cookie", [cookie]).send({ rid: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body[0].message).toEqual("Hello");
});

test("GET /api/messages/next/:offset", async () => {
    const res = await request(server).get("/api/message/next/2").set("Cookie", [cookie]).send({ rid: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
});
