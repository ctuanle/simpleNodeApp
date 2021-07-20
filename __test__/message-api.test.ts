import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

let cookie: string;
let uid: string;
let aid: string;

beforeAll(async () => {
    await sequeSync(sequelize);
    /**
     * Get cookie, uids of a normal user and an admin for using after
     */
    const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "azerty" });
    cookie = res.headers["set-cookie"];
    const user = await request(server).get("/api/user/username/user").set("Cookie", [cookie]);
    uid = user.body.data.uid;
    const admin = await request(server).get("/api/user/username/admin").set("Cookie", [cookie]);
    aid = admin.body.data.uid;

    // Create a room for the user
    await request(server).post("/api/room/add").set("Cookie", [cookie]).send({ uid: uid, username: "user" });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Message API Testing", () => {
    // Push a message
    // It should return a 200 OK code
    // and the message itself
    test("POST /api/message/add", async () => {
        const res = await request(server)
            .post("/api/message/add")
            .set("Cookie", [cookie])
            .send({ sid: aid, rid: uid, message: "Hello", roomId: 1 });

        expect(res.status).toBe(200);
        expect(res.body.data.roomId).toBe(1);
        expect(res.body.data.message).toEqual("Hello");
    });

    // Get number of messages
    // It should return a 200 OK code
    // and json data {count: number}
    test("GET /api/message/count", async () => {
        const res = await request(server).get("/api/message/count").set("Cookie", [cookie]);

        expect(res.status).toBe(200);
        expect(res.body.count).toBeTruthy();
    });

    // Get 15 latest messages
    // It should return a 200 OK code
    // and json data {data: messages}
    test("GET /api/messages/latest15", async () => {
        const res = await request(server).get("/api/message/latest15").set("Cookie", [cookie]).send({ rid: 1 });

        expect(res.status).toBe(200);
        expect(res.body.data[0].message).toEqual("Hello");
    });

    // Get 15 next messages
    // It should return a 200 OK code
    // and json data {data: messages}
    test("GET /api/messages/next/:offset", async () => {
        const res = await request(server).get("/api/message/next/2").set("Cookie", [cookie]).send({ rid: 1 });

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(0);
    });
});
