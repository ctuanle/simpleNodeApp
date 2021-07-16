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
    const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "admin", password: "azerty" });
    expect(res.headers["set-cookie"]).toBeTruthy();
    cookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
});

// let aid: string;
// test("GET /api/user/username/:username", async () => {
//     const res = await request(server)
//         .get("/api/user/username/admin")
//         .set("Cookie", [cookie])

//     expect(res.statusCode).toBe(200);
//     expect(res.body.uid).toBeTruthy();
//     expect(res.body.username).toEqual("admin");
//     aid = res.body.uid;
// });

test("POST /api/auth/signup", async () => {
    const res = await request(server)
        .post("/api/auth/signup")
        .send({ username: "user", email: "", password: "azerty" });
    expect(res.statusCode).toBe(201);
});

let uid: string;
test("GET /api/user/username/:username", async () => {
    const res = await request(server)
        .get("/api/user/username/user")
        .set("Cookie", [cookie])

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toBeTruthy();
    expect(res.body.username).toEqual("user");
    uid = res.body.uid;
});

test("POST /api/room/add", async () => {
    const res = await request(server)
        .post("/api/room/add")
        .set("Cookie", [cookie])
        .send({uid: uid, username: "user"});

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toEqual(uid);
    expect(res.body.rid).toBeTruthy();
});

test("GET /api/room/:uid", async () => {
    const res = await request(server)
        .get("/api/room/"+uid)
        .set("Cookie", [cookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.uid).toEqual(uid);
    expect(res.body.username).toEqual("user");
});

test("GET /api/room/all", async () => {
    const res = await request(server)
        .get("/api/room/all")
        .set("Cookie", [cookie]);
    
    expect(res.statusCode).toBe(200);
    expect(res.body[0].uid).toEqual(uid);
});

test("GET /api/room/five", async () => {
    const res = await request(server)
        .get("/api/room/five")
        .set("Cookie", [cookie]);
    
    expect(res.statusCode).toBe(200);
    expect(res.body[0].uid).toEqual(uid);
});
