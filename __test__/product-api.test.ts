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

describe("Product API Testing: GET Request", () => {

    // Get a product by its pid
    // It should return a 200 OK http code,
    // and send the product
    test("GET /api/product/:pid", async () => {
        const res = await request(server).get("/api/product/2");
        expect(res.status).toBe(200);
        expect(res.body.data.pid).toBe(2);
        expect(res.body.data.price).toBeTruthy();
        expect(res.body.data.category).toBeTruthy();
    });

    // Get a product by a nonexistent pid
    // It should return a 404 Not-found http code,
    // and a message "Product not found!"
    test("GET /api/product/:pid", async () => {
        const res = await request(server).get("/api/product/999");
        expect(res.status).toBe(404);
        expect(res.body.message).toEqual("Product not found!");
    });

    // GET first 12 products from db
    // It should return a 200 OK http code
    // and json data
    test("GET /api/product/page/1", async () => {
        const res = await request(server).get("/api/product/page/1");
        expect(res.status).toBe(200);
        expect(res.body.numpage).toBe(1);
        expect(res.body.products.length).toBeTruthy();
    });

    // GET all categories from db
    // It should return a 200 OK http code
    // and json data
    test("GET /api/category/all", async () => {
        const res = await request(server).get("/api/product/category/all");
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toMatchObject(["Uncategorized", "Book", "Phone", "Laptop"]);
    });

    // GET all products of a category
    // It should return a 200 OK http code
    // and json data
    test("GET /api/category/:cat", async () => {
        const res = await request(server).get("/api/product/category/Phone");
        expect(res.status).toBe(200);
        expect(res.body.cats).toMatchObject(["Uncategorized", "Book", "Phone", "Laptop"]);
        expect(res.body.products[0].category).toEqual("Phone");
    });

    // GET count all product
    // It should return a 200 OK http code
    // and a number
    test("GET /api/product/count", async () => {
        const res = await request(server).get("/api/product/count/all").set("Cookie", [cookie]);
        expect(res.body.count).toBeTruthy();
    });
});

describe("Product API Testing: POST/PUT Request", () => {

    // Add a product
    // It should return a 201 Created http code
    // and a message "Product added successfully!"
    test("POST /api/product/add", async () => {
        const res = await request(server)
            .post("/api/product/add")
            .set("Cookie", [cookie])
            .send({ name: "Test1", price: 123, category: "Book", images: "" });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual("Product added successfully!");
    });

    // Update a product
    // It should return a 200 OK http code
    // and a message "Product updated successfully!"
    test("PUT /api/product/:pid", async () => {
        const res = await request(server)
            .put("/api/product/1")
            .set("Cookie", [cookie])
            .send({ name: "Test1", price: 789, category: "Book", images: "" });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Product updated successfully!");
    });

    // Delete a product
    // It should return a 200 OK http code
    // and a message "Product deleted successfully!"
    test("DELETE /api/product/:pid", async () => {
        const res = await request(server).delete("/api/product/2").set("Cookie", [cookie]).send({ pid: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Product deleted successfully!");
    });
});



