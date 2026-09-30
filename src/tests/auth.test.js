const express = require("express");
const request = require("supertest");
const index = require("../routes/index");
const prisma = require("../../lib/prisma");

const app = express();

app.use(express.urlencoded({extended: false}));
app.use("/", index);

beforeEach(async () => {
    await prisma.job.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.client.deleteMany();
});

describe("POST /register", (done) => {
    test("POST request to create new employee" ,() => {
        request(app)
        .post("/register")
        .type("form")
        .send({
            name: "jamal",
            email: "example@gmail.com",
            role: "USER",
            phone: "224-546-3333",
            username: "jamal234",
            password: "dont leak this please"
        })
        .expect(200, done)
    })
    
})