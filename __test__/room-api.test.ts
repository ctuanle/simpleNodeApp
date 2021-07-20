import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

let cookie: string;
let uid: string;

beforeAll(async () => {
    await sequeSync(sequelize);
    const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "azerty" });
    cookie = res.headers["set-cookie"];
    const user = await request(server).get("/api/user/username/user").set("Cookie", [cookie]);
    uid = user.body.data.uid;
});

afterAll(async () => {
    await sequelize.close();
});

describe("Room API Testing", () => {

    // Create a room for user
    // It should return a 200 OK code
    // and json data {data : room}
    test("POST /api/room/add", async () => {
        const res = await request(server)
            .post("/api/room/add")
            .set("Cookie", [cookie])
            .send({ uid: uid, username: "user" });
    
        expect(res.status).toBe(200);
        expect(res.body.data.uid).toEqual(uid);
        expect(res.body.data.rid).toBeTruthy();
    });
    
    // Get a room a uid
    // It should return a 200 OK code
    // and json data {data : room}
    test("GET /api/room/:uid", async () => {
        const res = await request(server)
            .get("/api/room/" + uid)
            .set("Cookie", [cookie]);
    
        expect(res.status).toBe(200);
        expect(res.body.data.uid).toEqual(uid);
        expect(res.body.data.username).toEqual("user");
    });

    // Get a room with a wrong uid
    // It should return a 404 Not Found code
    // and a message "Room not found!"
    test("GET /api/room/:uid", async () => {
        const res = await request(server)
            .get("/api/room/skdjfhskdjf")
            .set("Cookie", [cookie]);
    
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual("Room not found!");
    });
    
    // GET all rooms
    // It should return a 200 OK code
    // and json data {data: rooms}
    test("GET /api/room/all", async () => {
        const res = await request(server).get("/api/room/all").set("Cookie", [cookie]);
    
        expect(res.status).toBe(200);
        expect(res.body.data[0].uid).toEqual(uid);
    });
    
    // GET 5 rooms
    // It should return a 200 OK code
    // and json data {data : rooms}
    test("GET /api/room/five", async () => {
        const res = await request(server).get("/api/room/five").set("Cookie", [cookie]);
    
        expect(res.status).toBe(200);
        expect(res.body.data[0].uid).toEqual(uid);
    });
});