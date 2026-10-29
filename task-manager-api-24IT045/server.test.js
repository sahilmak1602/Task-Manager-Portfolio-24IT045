const request = require("supertest");
const app = require("./server");

describe("Task Manager API Authentication", () => {
    test("GET /tasks without a token returns 401", async () => {
        const response = await request(app).get("/tasks");

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: "Access token required"
        });
    });

    test("GET /tasks with an invalid token returns 401", async () => {
        const response = await request(app)
            .get("/tasks")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: "Invalid or expired token"
        });
    });
});


