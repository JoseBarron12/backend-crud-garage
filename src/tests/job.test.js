const index = require('../routes/index');

const express = require("express");
const request = require("supertest");
const prisma = require('../../lib/prisma');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use("/", index);

beforeEach(async () => {
    await prisma.$transaction([
        prisma.job.deleteMany(),
        prisma.employee.deleteMany(),
        prisma.client.deleteMany(),
    ]);
});

describe("GET /job", (done) => {
    test("initial GET request", () => {
        request(app)
        .get("/job")
        .expect('Content-Type', /json/)
        .expect({
            jobs: []
        })
        .expect(200,done)
    });

    test("GET request with populated jobs database", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        
        const employeeCurrId = createEmployee[0].id;
        const clientCurrId = createClient[0].id;
        
        const currDate = new Date();

        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: employeeCurrId,
                    clientId: clientCurrId
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: employeeCurrId + 1,
                    clientId: clientCurrId + 1
                }
            ]
        })

        const jobCurrId = createJobs[0].id;

        const response = await request(app).get("/job").set('Accept', 'application/json');

        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.jobs).toEqual([
        {
            "id": jobCurrId,
            "desc": "random message one",
            "costCent": 234123,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "PAUSED",
            "employeeId": employeeCurrId,
            "clientId": clientCurrId,
            "employee": {
                "id": employeeCurrId,
                "name": "James Anderson",
                "email": "james.anderson@example.com",
                "role": "USER",
                "phone": "555-0101",
                "username": "janderson",
                "hashpassword": "$2b$10$dummyHashJames001"
            },
            "client": {
                "id": clientCurrId,
                "name": "jay brown",
                "email": "example1@gmail.com",
                "phoneNumber": "223-223-2222",
                "address": "2112 N asd adas Illinois"
            }
            },
            {
            "id": jobCurrId + 1,
            "desc": "random message two",
            "costCent": 321643,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "COMPLETED",
            "employeeId": employeeCurrId + 1,
            "clientId": clientCurrId + 1,
            "employee": {
                "id": employeeCurrId + 1,
                "name": "Maria Rodriguez",
                "email": "maria.rodriguez@example.com",
                "role": "USER",
                "phone": "555-0102",
                "username": "mrodriguez",
                "hashpassword": "$2b$10$dummyHashMaria002"
            },
            "client": {
                "id": clientCurrId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh"
            }
        }
        ])
        
    });

    test("GET request with given id", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        
        const employeeCurrId = createEmployee[0].id;
        const clientCurrId = createClient[0].id;
        
        const currDate = new Date();

        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: employeeCurrId,
                    clientId: clientCurrId
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: employeeCurrId + 1,
                    clientId: clientCurrId + 1
                }
            ]
        })

        const jobCurrId = createJobs[0].id;
        const response = await request(app).get(`/job/${jobCurrId}`).set('Accept', 'application/json');

        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.job).toEqual({
            "id": jobCurrId,
            "desc": "random message one",
            "costCent": 234123,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "PAUSED",
            "employeeId": employeeCurrId,
            "clientId": clientCurrId,
            "employee": {
                "id": employeeCurrId,
                "name": "James Anderson",
                "email": "james.anderson@example.com",
                "role": "USER",
                "phone": "555-0101",
                "username": "janderson",
                "hashpassword": "$2b$10$dummyHashJames001"
            },
            "client": {
                "id": clientCurrId,
                "name": "jay brown",
                "email": "example1@gmail.com",
                "phoneNumber": "223-223-2222",
                "address": "2112 N asd adas Illinois"
            }
        }
        )
    })

});

describe("POST /job", () => {
    test("POST request w/ populated employee + client schema", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });

        const employeeId = createEmployee[0].id;
        const clientId = createClient[0].id;
        const createdDate = new Date();


        const createRequest = await request(app).post("/job").type("form").send({
            desc: "filler description for a job that doesnt exist",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: createdDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        }).set('Accept', 'application/json');

        expect(createRequest.status).toEqual(200);

    })
});

describe("DELETE /job", () => {
    test("DELETE all request", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });

        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });

        const employeeCurrId = createEmployee[0].id;
        const clientCurrId = createClient[0].id;
        
        const currDate = new Date();

        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: employeeCurrId,
                    clientId: clientCurrId
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: employeeCurrId + 1,
                    clientId: clientCurrId + 1
                }
            ]
        })

        const currJobId = createJobs[0].id;

        const deleteRequest = await request(app).delete("/job").set('Accept', 'application/json');

        const response = await request(app).get("/job").set('Accept', 'application/json');
        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.jobs).toEqual([])
    })
    
    
    test("DELETE specific employee request with given id", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });

        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });

        const employeeCurrId = createEmployee[0].id;
        const clientCurrId = createClient[0].id;
        
        const currDate = new Date();

        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: employeeCurrId,
                    clientId: clientCurrId
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: employeeCurrId + 1,
                    clientId: clientCurrId + 1
                }
            ]
        })

        const currJobId = createJobs[0].id;

        const deleteRequest = await request(app).delete(`/job/${currJobId}`).set('Accept', 'application/json');

        const response = await request(app).get("/job").set('Accept', 'application/json');
        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.jobs).toEqual([
        {
            "id": currJobId + 1,
            "desc": "random message two",
            "costCent": 321643,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "COMPLETED",
            "employeeId": employeeCurrId + 1,
            "clientId": clientCurrId + 1,
            "employee": {
                "id": employeeCurrId + 1,
                "name": "Maria Rodriguez",
                "email": "maria.rodriguez@example.com",
                "role": "USER",
                "phone": "555-0102",
                "username": "mrodriguez",
                "hashpassword": "$2b$10$dummyHashMaria002"
            },
            "client": {
                "id": clientCurrId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh"
            }
        }
        ])
    })
});


describe("PUT /job", () => {
    test("PUT request to update specific job", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
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
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        
        const employeeCurrId = createEmployee[0].id;
        const clientCurrId = createClient[0].id;
        
        const currDate = new Date();

        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: employeeCurrId,
                    clientId: clientCurrId
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: employeeCurrId + 1,
                    clientId: clientCurrId + 1
                }
            ]
        })

        const jobCurrId = createJobs[0].id;

        const putRequest = await request(app)
        .put(`/job/${jobCurrId}`)
        .type("form")
        .send({
            desc: "updated random message one",
            costCent: 123456,
            createdAt: currDate,
            doneAt: currDate,
            progress: "PENDING",
            employeeId: employeeCurrId,
            clientId: clientCurrId
        })
        .set('Accept', 'application/json');

        const response = await request(app).get("/job");
        
        expect(response.header["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body.jobs).toEqual([
        {
            "id": jobCurrId + 1,
            "desc": "random message two",
            "costCent": 321643,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "COMPLETED",
            "employeeId": employeeCurrId + 1,
            "clientId": clientCurrId + 1,
            "employee": {
                "id": employeeCurrId + 1,
                "name": "Maria Rodriguez",
                "email": "maria.rodriguez@example.com",
                "role": "USER",
                "phone": "555-0102",
                "username": "mrodriguez",
                "hashpassword": "$2b$10$dummyHashMaria002"
            },
            "client": {
                "id": clientCurrId + 1,
                "name": "smtih rowe",
                "email": "example2@gmail.com",
                "phoneNumber": "253-123-2552",
                "address": "7657 South lansingh"
            }
        },
        {
            "id": jobCurrId,
            "desc": "updated random message one",
            "costCent": 123456,
            "createdAt": currDate.toISOString(),
            "doneAt": currDate.toISOString(),
            "progress": "PENDING",
            "employeeId": employeeCurrId,
            "clientId": clientCurrId,
            "employee": {
                "id": employeeCurrId,
                "name": "James Anderson",
                "email": "james.anderson@example.com",
                "role": "USER",
                "phone": "555-0101",
                "username": "janderson",
                "hashpassword": "$2b$10$dummyHashJames001"
            },
            "client": {
                "id": clientCurrId,
                "name": "jay brown",
                "email": "example1@gmail.com",
                "phoneNumber": "223-223-2222",
                "address": "2112 N asd adas Illinois"
            }
            },
        ])
    })
})


