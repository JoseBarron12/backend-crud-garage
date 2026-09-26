const index = require("../routes/index");
const request = require("supertest");
const express = require("express");
const prisma = require("../../lib/prisma");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/", index);

beforeEach(async () => {
    await prisma.employee.deleteMany();
})

describe('GET /user', () => {
    test("initial GET request", done => {
        request(app)
        .get("/employee")
        .expect('Content-Type', /json/)
        .expect({
            employees: []
        })
        .expect(200,done);
    });

    test("GET request with populated employee table", async () => {
        const createManyEmployee = await prisma.employee.createManyAndReturn({
            data: [
                 {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
                {
                    name: "Michael Thompson",
                    email: "michael.thompson@example.com",
                    role: "USER",
                    phone: "555-0103",
                    username: "mthompson",
                    hashpassword: "$2b$10$dummyHashMichael003",
                },
            ]
        });
        
        const response = await request(app).get("/employee").set('Accept', 'application/json')

        const currId = createManyEmployee[0].id;

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.employees).toEqual([
        {
            "email": "james.anderson@example.com",
            "hashpassword": "$2b$10$dummyHashJames001",
            "id": currId,
            "jobs": [],
            "name": "James Anderson",
            "phone": "555-0101",
            "role": "USER",
            "username": "janderson",
        },
        {
            "email": "maria.rodriguez@example.com",
            "hashpassword": "$2b$10$dummyHashMaria002",
            "id": currId + 1,
            "jobs": [],
            "name": "Maria Rodriguez",
            "phone": "555-0102",
            "role": "USER",
            "username": "mrodriguez",
        },
        {
            "email": "michael.thompson@example.com",
            "hashpassword": "$2b$10$dummyHashMichael003",
            "id": currId + 2,
            "jobs": [],
            "name": "Michael Thompson",
            "phone": "555-0103",
            "role": "USER",
            "username": "mthompson",
        },
        ]);
    });
    
    test("GET request with given id", async () => {
        const createManyEmployee = await prisma.employee.createManyAndReturn({
            data: [
                 {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
                {
                    name: "Michael Thompson",
                    email: "michael.thompson@example.com",
                    role: "USER",
                    phone: "555-0103",
                    username: "mthompson",
                    hashpassword: "$2b$10$dummyHashMichael003",
                },
            ]
        });
        const currId = createManyEmployee[0].id;


        const response = await request(app).get(`/employee/${currId}`).set('Accept', 'application/json')


        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.employee).toEqual(
        {
            "email": "james.anderson@example.com",
            "hashpassword": "$2b$10$dummyHashJames001",
            "id": currId,
            "jobs": [],
            "name": "James Anderson",
            "phone": "555-0101",
            "role": "USER",
            "username": "janderson",
        });
    });

});

describe('POST /user', () => {
    test("create user request with valid information", done => {
        request(app)
        .post("/employee")
        .type("form")
        .send({
            name: "random name",
            email: "random@gmail.com",
            role: "USER",
            phone: "224-387-2222",
            username: "yuhyuh",
            password: "56347",
        })
        .expect(302,done)  
    })
});


describe("DELETE /user", () => {
    test("DELETE all request ", async () => {
        const createManyEmployee = await prisma.employee.createManyAndReturn({
            data: [
                 {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
                {
                    name: "Michael Thompson",
                    email: "michael.thompson@example.com",
                    role: "USER",
                    phone: "555-0103",
                    username: "mthompson",
                    hashpassword: "$2b$10$dummyHashMichael003",
                },
            ]
        });
        
        const deleteRequest = await request(app).delete("/employee").set('Accept', 'application/json')

        const response = await request(app).get("/employee");

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.employees).toEqual([]);
    });

    /*
    
    test("DELETE specific employee request with given id", async () => {
        const createManyEmployee = await prisma.employee.createManyAndReturn({
            data: [
                 {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
                {
                    name: "Michael Thompson",
                    email: "michael.thompson@example.com",
                    role: "USER",
                    phone: "555-0103",
                    username: "mthompson",
                    hashpassword: "$2b$10$dummyHashMichael003",
                },
            ]
        });
        const currId = createManyEmployee[0].id;

        const response = await request(app).delete(`/employee/${currId}`).set('Accept', 'application/json')

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.employees).toEqual([
            {
                "email": "maria.rodriguez@example.com",
                "hashpassword": "$2b$10$dummyHashMaria002",
                "id": currId + 1,
                "jobs": [],
                "name": "Maria Rodriguez",
                "phone": "555-0102",
                "role": "USER",
                "username": "mrodriguez",
            },
            {
                "email": "michael.thompson@example.com",
                "hashpassword": "$2b$10$dummyHashMichael003",
                "id": currId + 2,
                "jobs": [],
                "name": "Michael Thompson",
                "phone": "555-0103",
                "role": "USER",
                "username": "mthompson",
            },
        ]);
    });*/
})

/* 


describe("PUT /user", () => {
    test("GET request with populated employee table", async () => {
        const createManyEmployee = await prisma.employee.createManyAndReturn({
            data: [
                 {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
                {
                    name: "Michael Thompson",
                    email: "michael.thompson@example.com",
                    role: "USER",
                    phone: "555-0103",
                    username: "mthompson",
                    hashpassword: "$2b$10$dummyHashMichael003",
                },
            ]
        });
        
        const currId = createManyEmployee[0].id;

        const response = await request(app).put(`/employee/${currId}`)
        .type("form")
        .send({name: "random name"
        })
        .set('Accept', 'application/json')

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.employees).toEqual([
        {
            "email": "james.anderson@example.com",
            "hashpassword": "$2b$10$dummyHashJames001",
            "id": currId,
            "jobs": [],
            "name": "random name",
            "phone": "555-0101",
            "role": "USER",
            "username": "janderson",
        },
        {
            "email": "maria.rodriguez@example.com",
            "hashpassword": "$2b$10$dummyHashMaria002",
            "id": currId + 1,
            "jobs": [],
            "name": "Maria Rodriguez",
            "phone": "555-0102",
            "role": "USER",
            "username": "mrodriguez",
        },
        {
            "email": "michael.thompson@example.com",
            "hashpassword": "$2b$10$dummyHashMichael003",
            "id": currId + 2,
            "jobs": [],
            "name": "Michael Thompson",
            "phone": "555-0103",
            "role": "USER",
            "username": "mthompson",
        },
        ]);
    })
})
*/