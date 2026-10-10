const express = require("express");
const request = require("supertest");
const index = require("../routes/index");
const prisma = require("../../lib/prisma");
const bcrypt = require("bcryptjs")

const app = express();

app.use(express.urlencoded({extended: false}));
app.use("/", index);

beforeEach(async () => {
    await prisma.job.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.client.deleteMany();
});

describe("POST /register", () => {
    test("POST request to create new employee" ,(done) => {
        request(app)
        .post("/auth/register")
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
    });
});

describe("POST /login", () => {
    test("POST request to login w/ exisiting credentials", async () => {
        const password = "generic123";
        const hashpassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.employee.create({
            data: {
                username: "jamal123",
                hashpassword: hashpassword,
                email: "example@gmail.com",
                role: "USER",
                phone: "223-456-3333",
                name: "jamal hersum"
            }
        });

        const response = await request(app)
        .post("/auth/login")
        .type("form")
        .send({
            username: "jamal123",
            password: password
        })
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty("token");

    });

    test("POST request w/ invalid username", async () => {
        const password = "generic123";
        const hashpassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.employee.create({
            data: {
                username: "jamal123",
                hashpassword: hashpassword,
                email: "example@gmail.com",
                role: "USER",
                phone: "223-456-3333",
                name: "jamal hersum"
            }
        });

        const response = await request(app)
        .post("/auth/login")
        .type("form")
        .send({
            username: "jamal1",
            password: password
        })
        expect(response.status).toEqual(400);
    })

    test("POST request w/ invalid password", async () => {
        const password = "generic123";
        const hashpassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.employee.create({
            data: {
                username: "jamal123",
                hashpassword: hashpassword,
                email: "example@gmail.com",
                role: "USER",
                phone: "223-456-3333",
                name: "jamal hersum"
            }
        });

        const response = await request(app)
        .post("/auth/login")
        .type("form")
        .send({
            username: "jamal123",
            password: "someotherpassword"
        })
        expect(response.status).toEqual(400);
    })


})