const index = require("../routes/index");
const request = require("supertest")

const express = require("express");
const prisma = require("../../lib/prisma");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

beforeEach(async () => {
    await prisma.client.deleteMany();
})

describe("GET /client", () => {
    test("initial GET request", (done) => {
        request(app)
        .get("/client")
        .expect('Content-Type', /json/)
        .expect({
            clients: []
        })
        .expect(200,done)
    });

    test("GET request populated database", async (done) => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const response = await request(app).get("/client").set('Accept', 'application/json');

        const currId = createManyEmployee[0].id;

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.clients).toEqual([
            {
                "id": currId,
                "name": "jay brown",
                "email": "example1@gmail.com",
                "phoneNumber": "223-223-2222",
                "address": "2112 N asd adas Illinois",
                "jobs": []
            },
            {
                "id": currId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh",
                "jobs": []
            },
            {
                "id": currId + 2,
                "name": "jamal hersym",
                "email": "example3@gmail.com",
                "phoneNumber": "223-243-7686",
                "address": "biriths columia",
                "jobs": []
            }
        ])
    })

    test("GET request for client w/ id", async (done) => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const currId = createManyEmployee[0].id;


        const response = await request(app).get(`/client/${currId}`).set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.client).toEqual([
            {
                "id": currId,
                "name": "jay brown",
                "email": "example1@gmail.com",
                "phoneNumber": "223-223-2222",
                "address": "2112 N asd adas Illinois",
                "jobs": []
            }
        ])
    })

});

describe("POST /client", () => {
    test("POST request to create client", (done) => {
        request(app)
        .post("/client")
        .type("form")
        .send({
            name: "jamal hersldsad",
            email: "filler@gmail",
            phone: "334-546-9832",
            address: "23 S Brokhill New Jersey 34422",
        })
        .expect(200,done)
    })
});


describe("DELETE /client", () => {
    test("DELETE request with populated database", async (done) => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const deleteRequest = await request(app).delete("/client").set('').set('Accept', 'application/json');
        const response = await request(app).get("/client")
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.clients).toEqual([]);
    });

    test("DELETE request for single client w/ id", async (done) => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const currId = clients[0].id;

        const deleteRequest = await request(app).delete(`/client/${currId}`);

        const response = await request(app).get("/client")
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.clients).toEqual([
            {
                "id": currId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh",
                "jobs": []
            },
            {
                "id": currId + 2,
                "name": "jamal hersym",
                "email": "example3@gmail.com",
                "phoneNumber": "223-243-7686",
                "address": "biriths columia",
                "jobs": []
            }
        ])
    })
});

describe("POST /client", () => {
    test("UPDATE request for client with id", async (done) => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const currId = clients[0].id;

        const postRequest = await request(app).post(`/client/${currId}`)
        .type("form")
        .send({
            name: "random name",
            email: "45@mail.com",
            phoneNumber: "342-675-8796",
            address: "56 ur dasd"
        })
        .set('Accept', 'application/json');

        const response = await request(app).get("/client")
        
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.clients).toEqual([
            {
                "id": currId,
                "name": "random name",
                "email": "45@mail.com",
                "phoneNumber": "342-675-8796",
                "address": "56 ur dasd",
                "jobs": []
            },
            {
                "id": currId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh",
                "jobs": []
            },
            {
                "id": currId + 2,
                "name": "jamal hersym",
                "email": "example3@gmail.com",
                "phoneNumber": "223-243-7686",
                "address": "biriths columia",
                "jobs": []
            }
        ])

    })
})