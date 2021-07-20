import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

let cookie: string;

beforeAll(async () => {
    await sequeSync(sequelize);
    const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "azerty" });
    cookie = res.headers["set-cookie"];
});

afterAll(async () => {
    await sequelize.close();
});

describe("User API Testing", () => {
    let uid: string;

    // GET the first 5 users from db
    // It should return a 200 OK code
    // and json data
    test("GET /api/user/five", async () => {
        const res = await request(server).get("/api/user/five").set("Cookie", [cookie]);

        expect(res.status).toBe(200);
        uid = res.body.data[0].uid;
        expect(res.body.data[0].uid).toBeTruthy();
    });

    // GET the number of users
    // It should return a 200 OK code
    // and json data : {count: number}
    test("GET /api/user/count", async () => {
        const res = await request(server).get("/api/user/count").set("Cookie", [cookie]);

        expect(res.status).toBe(200);
        expect(res.body.count).toBeTruthy();
    });

    // GET user by their uid
    // It shoud return a 200 OK code
    // and json data {data : user}
    test("GET /api/user/:uid", async () => {
        const res = await request(server)
            .get("/api/user/" + uid)
            .set("Cookie", [cookie]);

        expect(res.status).toBe(200);
        expect(res.body.data.uid).toEqual(uid);
    });

    // GET user with nonexistend uid
    // It shoud return a 404 Not Found code
    // and a message "User not found!"
    test("GET /api/user/:uid", async () => {
        const res = await request(server).get("/api/user/sdkfjhsdkfsbdnfskdfhsd").set("Cookie", [cookie]);

        expect(res.status).toBe(404);
        expect(res.body.message).toEqual("User not found!");
    });

    // GET user by username
    // It should return a 200 OK code
    // and json data
    test("GET /api/user/username/:username", async () => {
        const res = await request(server).get("/api/user/username/admin").set("Cookie", [cookie]);

        expect(res.status).toBe(200);
        expect(res.body.data.username).toEqual("admin");
    });
});
