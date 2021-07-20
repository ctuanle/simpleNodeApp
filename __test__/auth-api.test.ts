import server from "../app";
import request from "supertest";
import { sequelize, sequeSync } from "../src/db/models";

beforeAll(async () => {
    await sequeSync(sequelize);
});

afterAll(async () => {
    await sequelize.close();
});

let cookie: string;

describe("Authentication API Testing: [SIGNUP] /auth/signup", () => {
    // It should return a OK 201 http code,
    // and a message "User account successfully created."
    test("POST /api/auth/signup", async () => {
        const res = await request(server)
            .post("/api/auth/signup")
            .send({ username: "jtest", email: "jtest@node.io", password: "azerty" });

        expect(res.status).toBe(201);
        expect(res.body.message).toEqual("User account successfully created.");
    });

    // It should return a 500 Internal Server Error http code,
    // and a message "Username is already taken!"
    test("POST /api/auth/signup", async () => {
        const res = await request(server)
            .post("/api/auth/signup")
            .send({ username: "jtest", email: "", password: "azerty" });

        expect(res.status).toBe(500);
        expect(res.body.message).toEqual("Username is already taken!");
    });

    // It should return a 500 Internal Server Error http code,
    // and a message "Email is already taken!"
    test("POST /api/auth/signup", async () => {
        const res = await request(server)
            .post("/api/auth/signup")
            .send({ username: "abc", email: "jtest@node.io", password: "azerty" });

        expect(res.status).toBe(500);
        expect(res.body.message).toEqual("Email is already taken!");
    });
});

describe("Authentication API Testing: [LOGIN] /auth/login", () => {
    // It should return a 401 Unauthorized http code,
    // and a message "Username not found!"
    test("POST /api/auth/login", async () => {
        const res = await request(server).post("/api/auth/login").send({ username: "abc", password: "azerty" });

        expect(res.status).toBe(401);
        expect(res.body.message).toEqual("Username not found!");
    });

    // It should return a 401 Unauthorized http code,
    // and a message "Incorrect password!"
    test("POST /api/auth/login", async () => {
        const res = await request(server).post("/api/auth/login").send({ username: "jtest", password: "abcdef" });

        expect(res.status).toBe(401);
        expect(res.body.message).toEqual("Incorrect password!");
    });

    // It should return a OK 200 http code,
    // set the cookie ctle_user_token
    // and a value for redirection
    test("POST /api/auth/login", async () => {
        const res = await request(server).post("/api/auth/login").send({ username: "jtest", password: "azerty" });

        expect(res.statusCode).toBe(200);
        expect(res.headers["set-cookie"]).toBeTruthy();
        cookie = res.headers["set-cookie"];
        expect(res.body.newURL).toEqual("/");
    });

    // It should return a 200 OK http code,
    // and clear the cookie named "ctle_user_token" on the browser
    test("POST /api/auth/logout", async () => {
        const res = await request(server).post("/api/auth/logout").set("Cookie", [cookie]);

        expect(res.statusCode).toBe(200);
    });
});

describe("Authentication API Testing: [GET INFO] /auth/info", () => {
    // It should reutrn a 202 Accepted http code,
    test("GET /api/auth/info", async () => {
        const res = await request(server).get("/api/auth/info");

        expect(res.statusCode).toBe(202);
    });

    // It should reutrn a 200 OK http code,
    // and return a json
    test("GET /api/auth/info", async () => {
        const res = await request(server).get("/api/auth/info").set("Cookie", [cookie]);

        expect(res.statusCode).toBe(200);
        expect(res.body.uid).toBeTruthy();
        expect(res.body.token).toBeTruthy();
        expect(res.body.role).toEqual("NORMAL_USER");
    });
});
